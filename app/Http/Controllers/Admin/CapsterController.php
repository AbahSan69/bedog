<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CapsterController extends Controller
{
    public function index()
    {
        $capsters = Capster::latest()->get();
        return view('admin.capster', compact('capsters'));
    }

    public function create()
    {
        return view('admin.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'          => 'required|string|max:255',
            'no_hp'         => 'nullable|string|max:20',
            'spesialisasi'  => 'nullable|string|max:255',
            'status'        => 'required|in:Aktif,Nonaktif',
            'foto'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only('nama', 'no_hp', 'spesialisasi', 'status');

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('capsters', 'public');
        }

        Capster::create($data);

        return redirect()->route('admin.capster.index')->with('success', 'Capster baru berhasil ditambahkan.');
    }

    public function edit(Capster $capster)
    {
        return view('admin.edit', compact('capster'));
    }

    public function update(Request $request, Capster $capster)
    {
        $request->validate([
            'nama'          => 'required|string|max:255',
            'no_hp'         => 'nullable|string|max:20',
            'spesialisasi'  => 'nullable|string|max:255',
            'status'        => 'required|in:Aktif,Nonaktif',
            'foto'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only('nama', 'no_hp', 'spesialisasi', 'status');

        if ($request->hasFile('foto')) {
            if ($capster->foto) {
                Storage::disk('public')->delete($capster->foto);
            }
            $data['foto'] = $request->file('foto')->store('capsters', 'public');
        }

        $capster->update($data);

        return redirect()->route('admin.capster.index')->with('success', 'Data capster berhasil diperbarui.');
    }

    public function destroy(Capster $capster)
    {
        if ($capster->foto) {
            Storage::disk('public')->delete($capster->foto);
        }

        $capster->delete();

        return redirect()->route('admin.capster.index')->with('success', 'Capster berhasil dihapus.');
    }
}