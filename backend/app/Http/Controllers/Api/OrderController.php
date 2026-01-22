<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * CUSTOMER - BUAT ORDER (PUBLIC, TANPA AUTH)
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name'    => 'required|string|max:100',
            'customer_email'   => 'nullable|email|max:100',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'required|string|max:255',

            // 🔥 PAYMENT (HANYA METHOD)
            'payment_method'   => 'required|in:dana,gopay,ovo,shopeepay',

            // ITEMS
            'items'            => 'required|array|min:1',
            'items.*.menu_id'  => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1|max:99',
        ]);

        DB::beginTransaction();

        try {
            // 🧾 BUAT ORDER
            $order = Order::create([
                'order_code'      => 'ORD-' . strtoupper(Str::random(8)),
                'customer_name'   => $data['customer_name'],
                'customer_email'  => $data['customer_email'] ?? null,
                'customer_phone'  => $data['customer_phone'],
                'customer_address' => $data['customer_address'],
                'payment_method'  => $data['payment_method'],
                'total_price'     => 0,
                'status'          => 'pending',
            ]);

            $total = 0;

            // 📱 PESAN WHATSAPP
            $message  = "Halo Admin 👋\n";
            $message .= "Saya mau pesan:\n\n";
            $message .= "Nama: {$order->customer_name}\n";
            $message .= "No HP: {$order->customer_phone}\n";
            $message .= "Alamat: {$order->customer_address}\n\n";
            $message .= "Metode Pembayaran:\n";
            $message .= "- " . strtoupper($order->payment_method) . "\n\n";
            $message .= "Pesanan:\n";

            foreach ($data['items'] as $item) {
                $menu = Menu::lockForUpdate()->findOrFail($item['menu_id']);

                if ($menu->stock < $item['quantity']) {
                    throw new \Exception("Stok {$menu->name} tidak mencukupi");
                }

                // kurangi stok
                $menu->decrement('stock', $item['quantity']);


                $subtotal = $menu->price * $item['quantity'];
                $total += $subtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id'  => $menu->id,
                    'qty'      => $item['quantity'],
                    'price'    => $menu->price,
                ]);

                $message .= "- {$menu->name} x{$item['quantity']} = Rp "
                    . number_format($subtotal) . "\n";
            }

            $shipping = 15000;
            $totalWithShipping = $total + $shipping;

            $message .= "\nOngkir: Rp " . number_format($shipping);
            $message .= "\nTotal Bayar: Rp " . number_format($totalWithShipping) . "\n\n";
            $message .= "Terima kasih 🙏";

            $order->update(['total_price' => $totalWithShipping]);

            DB::commit();

            // 📱 NOMOR WA ADMIN
            $adminPhone = '6282327009116';

            $waUrl = "https://wa.me/{$adminPhone}?text=" . urlencode($message);

            return response()->json([
                'message'       => 'Order siap dikirim ke WhatsApp',
                'order_code'    => $order->order_code,
                'whatsapp_url'  => $waUrl
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal membuat order',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * CUSTOMER - CEK DETAIL ORDER
     */
    public function show($code)
    {
        $order = Order::with('items.menu')
            ->where('order_code', $code)
            ->firstOrFail();

        // Regenerate WA Message for status page
        $message  = "Halo Admin 👋\n";
        $message .= "Saya mau konfirmasi pesanan:\n\n";
        $message .= "Kode: {$order->order_code}\n";
        $message .= "Nama: {$order->customer_name}\n";
        $message .= "Total: Rp " . number_format($order->total_price) . "\n\n";
        $message .= "Terima kasih 🙏";

        $adminPhone = '6282327009116';
        $waUrl = "https://wa.me/{$adminPhone}?text=" . urlencode($message);

        // Add wa_url to order object
        $order->whatsapp_url = $waUrl;

        return response()->json($order);
    }

    /**
     * ADMIN - LIST ORDER
     */
    public function index()
    {
        $orders = Order::with('items.menu')->latest()->paginate(5);

        return response()->json([
            'orders' => $orders,
            'stats' => [
                'total_revenue' => Order::where('status', 'completed')->sum('total_price'),
                'completed_count' => Order::where('status', 'completed')->count(),
                'processing_count' => Order::whereNotIn('status', ['completed', 'cancelled'])->count(),
            ]
        ]);
    }

    /**
     * ADMIN - UPDATE STATUS ORDER
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,on_delivery,completed,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Status order diperbarui',
        ]);
    }

    /**
     * ADMIN - EXPORT REKAP (CSV)
     */
    public function export()
    {
        $orders = Order::latest()->get();

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'Kode Pesanan',
                'Customer',
                'Email',
                'No HP',
                'Alamat',
                'Metode Pembayaran',
                'Status',
                'Total Harga',
                'Tanggal'
            ]);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->order_code,
                    $order->customer_name,
                    $order->customer_email,
                    $order->customer_phone,
                    $order->customer_address,
                    strtoupper($order->payment_method),
                    strtoupper($order->status),
                    $order->total_price,
                    $order->created_at->format('d-m-Y H:i')
                ]);
            }

            fclose($file);
        };

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=rekap-penjualan-" . date('d-m-Y') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        return response()->stream($callback, 200, $headers);
    }
}
