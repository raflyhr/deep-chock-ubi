<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_code',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'total_price',
        'payment_method',
        'status'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
