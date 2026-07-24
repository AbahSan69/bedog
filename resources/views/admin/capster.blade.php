<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola Capster - Golden Barbershop</title>
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
        .header-actions .btn { white-space: nowrap; }
    </style>
</head>
<body class="py-4">
    <div class="container-fluid px-3 px-lg-5">

        <!-- Navigation Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
                <h2 class="fw-bold text-warning mb-0">
                    <i class="fa-solid fa-user-scissors me-2"></i>KELOLA CAPSTER
                </h2>
                <p class="text-secondary small mb-0">Data Kapster/Barber Golden Barbershop</p>
            </div>

            <div class="d-flex flex-wrap gap-2 header-actions">
                <a href="{{ route('admin.capster.create') }}" class="btn btn-warning btn-sm fw-bold">
                    <i class="fa-solid fa-plus me-1"></i> Tambah Capster
                </a>
                <a href="{{ route('admin.index') }}" class="btn btn-outline-warning btn-sm">
                    <i class="fa-solid fa-arrow-left me-1"></i> Kembali ke Dashboard
                </a>
            </div>
        </div>

        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        <!-- Table Data -->
        <div class="card card-custom p-3 shadow-lg">
            <div class="table-responsive">
                <table class="table table-dark-custom table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="text-center">Foto</th>
                            <th>Nama</th>
                            <th>No. WhatsApp</th>
                            <th>Spesialisasi</th>
                            <th>Status</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($capsters as $item)
                            <tr>
                                <td class="text-center">
                                    @if($item->foto)
                                        <img src="{{ asset('storage/' . $item->foto) }}" alt="{{ $item->nama }}"
                                             class="rounded-circle" width="45" height="45" style="object-fit:cover;">
                                    @else
                                        <div class="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center"
                                             style="width:45px; height:45px;">
                                            <i class="fa-solid fa-user text-light"></i>
                                        </div>
                                    @endif
                                </td>
                                <td class="fw-bold text-light">{{ $item->nama }}</td>
                                <td>
                                    @if($item->no_hp)
                                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $item->no_hp) }}" target="_blank" class="text-success text-decoration-none">
                                            <i class="fa-brands fa-whatsapp me-1"></i>{{ $item->no_hp }}
                                        </a>
                                    @else
                                        <span class="text-secondary">-</span>
                                    @endif
                                </td>
                                <td>
                                    <span class="badge bg-dark text-warning border border-warning">
                                        {{ $item->spesialisasi ?: '-' }}
                                    </span>
                                </td>
                                <td>
                                    @if($item->status == 'Aktif')
                                        <span class="badge bg-success">Aktif</span>
                                    @else
                                        <span class="badge bg-secondary">Nonaktif</span>
                                    @endif
                                </td>
                                <td class="text-center">
                                    <a href="{{ route('admin.capster.edit', $item->id) }}" class="btn btn-outline-warning btn-sm me-1">
                                        <i class="fa-solid fa-pen"></i>
                                    </a>
                                    <form action="{{ route('admin.capster.destroy', $item->id) }}" method="POST" class="d-inline"
                                          onsubmit="return confirm('Yakin ingin menghapus capster ini?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-outline-danger btn-sm">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-5 text-secondary">
                                    <i class="fa-regular fa-folder-open fa-2x mb-2 d-block"></i>
                                    Belum ada data capster.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>