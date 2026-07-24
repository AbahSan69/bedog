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
        .header-actions .btn { white-space: nowrap; }
        .action-buttons { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    </style>
</head>
<body class="py-4">
    <div class="container-fluid px-3 px-lg-5">

        <!-- Navigation Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
            <div>
                <h2 class="fw-bold text-warning mb-0">
                    <i class="fa-solid fa-scissors me-2"></i>GOLDEN BARBERSHOP - DASHBOARD ADMIN
                </h2>
                <p class="text-secondary small mb-0">Halaman Pengelolaan Data Booking Pelanggan (Terproteksi Login)</p>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-3 header-actions">
                <span class="text-light small">
                    <i class="fa-solid fa-user-circle me-1 text-warning"></i> {{ Auth::user()->name }}
                </span>

                <div class="d-flex gap-2">
                    <a href="{{ route('admin.capster.index') }}" class="btn btn-outline-info btn-sm">
                        <i class="fa-solid fa-user-scissors me-1"></i> Kelola Capster
                    </a>

                    <a href="{{ route('admin.index') }}" class="btn btn-outline-warning btn-sm">
                        <i class="fa-solid fa-arrows-rotate me-1"></i> Refresh
                    </a>

                    <form action="{{ route('logout') }}" method="POST" class="d-inline m-0">
                        @csrf
                        <button type="submit" class="btn btn-outline-danger btn-sm">
                            <i class="fa-solid fa-right-from-bracket me-1"></i> Logout
                        </button>
                    </form>
                </div>
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
                            <th class="text-center">NO</th>
                            <th>No. Booking</th>
                            <th>Nama Pelanggan</th>
                            <th>No. WhatsApp</th>
                            <th>Layanan</th>
                            <th>Kapster/Barber</th>
                            <th>Tanggal & Waktu</th>
                            <th>Status</th>
                            <th>Waktu Buat</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($bookings as $item)
                            <tr>
                                <td class="text-center font-monospace fw-bold text-warning">{{ $loop->iteration }}</td>
                                <td class="fw-bold text-dark">{{ $item->nomor_antrian }}</td>
                                <td class="fw-bold text-dark">{{ $item->nama }}</td>
                                <td>
                                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $item->no_hp) }}" target="_blank" class="text-success text-decoration-none">
                                        <i class="fa-brands fa-whatsapp me-1"></i>{{ $item->no_hp }}
                                    </a>
                                </td>
                                <td><span class="badge bg-secondary">{{ $item->layanan }}</span></td>
                                <td><span class="badge bg-dark text-warning border border-warning">{{ $item->barber }}</span></td>
                                <td class="font-monospace">
                                    {{ $item->tanggal->format('Y-m-d') }} <br>
                                    <span class="text-warning fw-bold">{{ $item->waktu }} WIB</span>
                                </td>
                                <td>
                                    @if($item->status == 'Confirmed')
                                        <span class="badge bg-success">Confirmed</span>
                                    @elseif($item->status == 'Completed')
                                        <span class="badge bg-info text-dark">Completed</span>
                                    @elseif($item->status == 'Cancelled')
                                        <span class="badge bg-danger">Cancelled</span>
                                    @else
                                        <span class="badge bg-warning text-dark">Pending</span>
                                    @endif
                                </td>
                                <td class="small text-secondary">
                                    {{ $item->created_at ? $item->created_at->format('d-M-Y H:i') : '-' }}
                                </td>
                                <td class="text-center">
                                    <div class="action-buttons">
                                        <form action="{{ route('admin.updateStatus', $item->id) }}" method="POST" class="w-100">
                                            @csrf
                                            @method('PATCH')
                                            <select name="status" onchange="this.form.submit()" class="form-select form-select-sm bg-dark text-light border-secondary">
                                                <option value="Pending" {{ $item->status == 'Pending' ? 'selected' : '' }}>Pending</option>
                                                <option value="Confirmed" {{ $item->status == 'Confirmed' ? 'selected' : '' }}>Confirmed</option>
                                                <option value="Completed" {{ $item->status == 'Completed' ? 'selected' : '' }}>Completed</option>
                                                <option value="Cancelled" {{ $item->status == 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
                                            </select>
                                        </form>
                                        <form action="{{ route('admin.destroy', $item->id) }}" method="POST"
                                              onsubmit="return confirm('Yakin ingin menghapus booking ini?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-outline-danger btn-sm">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center py-5 text-secondary">
                                    <i class="fa-regular fa-folder-open fa-2x mb-2 d-block"></i>
                                    Belum ada data pesanan booking yang masuk.
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