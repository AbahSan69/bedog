<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Jadwal - Barbershop Premier</title>
    <!-- Bootstrap 5 CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
        .btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 600; border: none; }
        .btn-gold:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .form-control, .form-select { background-color: #0f172a; border: 1px solid #475569; color: #fff; }
        .form-control:focus, .form-select:focus { background-color: #0f172a; border-color: #f59e0b; color: #fff; box-shadow: 0 0 0 0.25rem rgba(245, 158, 11, 0.25); }
    </style>
</head>
<body class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                
                <div class="text-center mb-4">
                    <h1 class="fw-bold text-warning"><i class="fa-solid fa-scissors me-2"></i>GOLDEN BARBERSHOP</h1>
                    <p class="text-secondary">Pesan Jadwal Potong Rambut & Grooming Pria Online</p>
                </div>

                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <i class="fa-solid fa-circle-check me-2"></i> {{ session('success') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                <div class="card card-custom p-4 shadow-lg">
                    <h4 class="mb-3 text-light border-bottom border-secondary pb-2">Formulir Booking Pelanggan</h4>
                    
                    <form action="{{ route('booking.store') }}" method="POST">
                        @csrf
                        
                        <!-- Nama Lengkap -->
                        <div class="mb-3">
                            <label for="nama" class="form-label text-secondary">Nama Lengkap <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="nama" name="nama" value="{{ old('nama') }}" required placeholder="Contoh: Ahmad Rizki">
                        </div>

                        <!-- Nomor HP / WhatsApp -->
                        <div class="mb-3">
                            <label for="no_hp" class="form-label text-secondary">Nomor WhatsApp / HP <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="no_hp" name="no_hp" value="{{ old('no_hp') }}" required placeholder="Contoh: 081234567890">
                        </div>

                        <!-- Pilihan Layanan -->
                        <div class="mb-3">
                            <label for="layanan" class="form-label text-secondary">Pilihan Layanan <span class="text-danger">*</span></label>
                            <select class="form-select" id="layanan" name="layanan" required>
                                <option value="" disabled {{ old('layanan') ? '' : 'selected' }}>-- Pilih Layanan Barbershop --</option>
                                <option value="Haircut (Potong Rambut)" {{ old('layanan') == 'Haircut (Potong Rambut)' ? 'selected' : '' }}>Haircut (Potong Rambut)</option>
                                <option value="Shaving (Cukur Jenggot)" {{ old('layanan') == 'Shaving (Cukur Jenggot)' ? 'selected' : '' }}>Shaving (Cukur Jenggot)</option>
                                <option value="Hair Color (Pewarnaan)" {{ old('layanan') == 'Hair Color (Pewarnaan)' ? 'selected' : '' }}>Hair Color (Pewarnaan Rambut)</option>
                                <option value="Full Package (Lengkap)" {{ old('layanan') == 'Full Package (Lengkap)' ? 'selected' : '' }}>Full Package (Lengkap)</option>
                            </select>
                        </div>

                        <!-- Pilihan Barber -->
                        <div class="mb-3">
                            <label for="barber" class="form-label text-secondary">Pilihan Kapster / Barber <span class="text-danger">*</span></label>
                            <select class="form-select" id="barber" name="barber" required>
                               <option value="" disabled {{ old('barber') ? '' : 'selected' }}>-- Pilih Kapster / Barber --</option>
                                @foreach($barbers as $barber)
                                    <option value="{{ $barber->nama }}" {{ old('barber') == $barber->nama ? 'selected' : '' }}>
                                        {{ $barber->nama }} - {{ $barber->spesialisasi }}
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Tanggal & Waktu -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="tanggal" class="form-label text-secondary">Tanggal <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="tanggal" name="tanggal" value="{{ old('tanggal', date('Y-m-d')) }}" min="{{ date('Y-m-d') }}" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="waktu" class="form-label text-secondary">Waktu / Jam <span class="text-danger">*</span></label>
                                <input type="time" class="form-control" id="waktu" name="waktu" value="{{ old('waktu') }}" required>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-gold w-100 py-3 mt-3 fs-5">
                            <i class="fa-solid fa-calendar-check me-2"></i> Kirim Pesanan Booking
                        </button>
                    </form>
                </div>
                
                <div class="text-center mt-4">
                    <a href="{{ route('admin.index') }}" class="text-secondary text-decoration-none small">
                        <i class="fa-solid fa-lock me-1"></i> Masuk ke Dashboard Admin
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"></script>
</body>
</html>