<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_id',
        'qty',
        'price',
    ];

    public function menu(){
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    public function order(){
        return $this->belongsTo(Order::class, 'order_id');
    }
}
