<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Daftar Booking Barbershop</title>
    <!-- Bootstrap 5 CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
        .table-dark-custom { background-color: #1e293b; color: #f8fafc; }
        .table-dark-custom th { background-color: #334155; color: #f59e0b; border-color: #475569; }
        .table-dark-custom td { border-color: #334155; vertical-align: middle; }
    </style>
</head>
<body class="py-4">

<div class="container-fluid px-lg-5 py-4" style="background-color:#0f172a; min-height:100vh; color:#f8fafc;">

    <div class="mb-4 pb-3 border-bottom border-secondary">
        <h2 class="fw-bold text-warning mb-0"><i class="fa-solid fa-user-pen me-2"></i>EDIT CAPSTER</h2>
    </div>

    <div class="card p-4 shadow-lg" style="background:#1e293b; border:1px solid #334155; border-radius:12px; max-width:600px;">

        @if($capster->foto)
            <div class="mb-3">
                <img src="{{ asset('storage/' . $capster->foto) }}" class="rounded-circle" width="80" height="80" style="object-fit:cover;">
            </div>
        @endif

        <form action="{{ route('admin.capster.update', $capster->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label class="form-label text-secondary">Nama</label>
                <input type="text" name="nama" value="{{ old('nama', $capster->nama) }}"
                       class="form-control bg-dark text-light border-secondary @error('nama') is-invalid @enderror">
                @error('nama')<div class="invalid-feedback">{{ $message }}</div>@enderror
            </div>

            <div class="mb-3">
                <label class="form-label text-secondary">No. WhatsApp</label>
                <input type="text" name="no_hp" value="{{ old('no_hp', $capster->no_hp) }}"
                       class="form-control bg-dark text-light border-secondary @error('no_hp') is-invalid @enderror">
                @error('no_hp')<div class="invalid-feedback">{{ $message }}</div>@enderror
            </div>

            <div class="mb-3">
                <label class="form-label text-secondary">Spesialisasi</label>
                <input type="text" name="spesialisasi" value="{{ old('spesialisasi', $capster->spesialisasi) }}"
                       class="form-control bg-dark text-light border-secondary @error('spesialisasi') is-invalid @enderror">
                @error('spesialisasi')<div class="invalid-feedback">{{ $message }}</div>@enderror
            </div>

            <div class="mb-3">
                <label class="form-label text-secondary">Status</label>
                <select name="status" class="form-select bg-dark text-light border-secondary">
                    <option value="Aktif" {{ old('status', $capster->status) == 'Aktif' ? 'selected' : '' }}>Aktif</option>
                    <option value="Nonaktif" {{ old('status', $capster->status) == 'Nonaktif' ? 'selected' : '' }}>Nonaktif</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="form-label text-secondary">Ganti Foto (opsional)</label>
                <input type="file" name="foto" accept="image/*"
                       class="form-control bg-dark text-light border-secondary @error('foto') is-invalid @enderror">
                @error('foto')<div class="invalid-feedback">{{ $message }}</div>@enderror
            </div>

            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-warning fw-bold">
                    <i class="fa-solid fa-save me-1"></i> Update
                </button>
                <a href="{{ route('admin.capster.index') }}" class="btn btn-outline-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

</body>
</html>
