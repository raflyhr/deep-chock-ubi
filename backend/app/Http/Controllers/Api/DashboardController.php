<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Menu::count();
        $totalOrders = Order::count(); // "jangan dibatasi" - show total orders regardless of status
        $totalSales = Order::where('status', 'completed')->sum('total_price');

        $recentOrders = Order::latest()->paginate(5); // "batasi 5 dan dibuat paginate"

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'total_orders' => $totalOrders,
                'total_sales' => (float) $totalSales,
            ],
            'recent_orders' => $recentOrders
        ]);
    }
}
