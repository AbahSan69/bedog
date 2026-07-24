<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capster extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama', 'no_hp', 'spesialisasi', 'foto', 'status',
    ];
}