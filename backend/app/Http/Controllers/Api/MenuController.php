<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // PUBLIC - LIST MENU (ONLY AVAILABLE)
    public function menu()
    {
        return response()->json(
            Menu::where('is_available', true)->latest()->get()
        );
    }

    // ADMIN - LIST ALL MENU
    public function index()
    {
        return response()->json(
            Menu::latest()->paginate(5)
        );
    }

    // PUBLIC - DETAIL MENU
    public function show(Menu $menu)
    {
        return response()->json($menu);
    }

    // ADMIN - TAMBAH MENU
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_available' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')
                ->store('menu', 'public');
        }

        $menu = Menu::create($data);

        return response()->json([
            'message' => 'Menu berhasil ditambahkan',
            'data' => $menu
        ], 201);
    }

    // ADMIN - UPDATE MENU
    public function update(Request $request, Menu $menu)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|integer|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'is_available' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($menu->image) {
                Storage::disk('public')->delete($menu->image);
            }

            $data['image'] = $request->file('image')
                ->store('menu', 'public');
        }

        $menu->update($data);

        return response()->json([
            'message' => 'Menu berhasil diperbarui',
            'data' => $menu
        ]);
    }

    // ADMIN - HAPUS MENU
    public function destroy(Menu $menu)
    {
        if ($menu->image) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->delete();

        return response()->json([
            'message' => 'Menu berhasil dihapus'
        ]);
    }
}
