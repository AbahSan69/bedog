<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Barbershop Booking</title>
    <!-- Bootstrap 5 CSS via CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-h: 100vh; display: flex; align-items: center; }
        .card-login { background: #1e293b; border: 1px solid #334155; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .btn-gold { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 700; border: none; }
        .btn-gold:hover { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
        .form-control { background-color: #0f172a; border: 1px solid #475569; color: #fff; }
        .form-control:focus { background-color: #0f172a; border-color: #f59e0b; color: #fff; box-shadow: 0 0 0 0.25rem rgba(245, 158, 11, 0.25); }
    </style>
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card card-login p-4">
                    
                    <div class="text-center mb-4">
                        <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                            <i class="fa-solid fa-user-shield fa-2x"></i>
                        </div>
                        <h3 class="fw-bold text-white mb-1">Login Admin</h3>
                        <p class="text-secondary small">Golden Management Portal</p>
                    </div>

                    <!-- Alert Kredensial Demo -->
                    <div class="alert alert-dark border-secondary text-warning small mb-3">
                        <i class="fa-solid fa-lightbulb me-1"></i> <strong>Akun Demo:</strong><br>
                        Email/User: <code>admin@barbershop.com</code><br>
                        Password: <code>admin123</code>
                    </div>

                    <!-- Notification Alert -->
                    @if(session('success'))
                        <div class="alert alert-success small mb-3">
                            {{ session('success') }}
                        </div>
                    @endif

                    @if($errors->any())
                        <div class="alert alert-danger small mb-3">
                            <ul class="mb-0 ps-3">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form action="{{ route('login.post') }}" method="POST">
                        @csrf
                        
                        <div class="mb-3">
                            <label for="email" class="form-label text-secondary small text-uppercase font-weight-bold">Email / Username</label>
                            <div class="input-group">
                                <span class="input-group-text bg-dark border-secondary text-secondary"><i class="fa-solid fa-user"></i></span>
                                <input type="text" class="form-control" id="email" name="email" value="{{ old('email', 'admin@barbershop.com') }}" required placeholder="admin@barbershop.com">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="password" class="form-label text-secondary small text-uppercase font-weight-bold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-dark border-secondary text-secondary"><i class="fa-solid fa-key"></i></span>
                                <input type="password" class="form-control" id="password" name="password" value="admin123" required placeholder="••••••••">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-gold w-100 py-2.5">
                            <i class="fa-solid fa-right-to-bracket me-2"></i> Masuk ke Dashboard
                        </button>
                    </form>

                    <div class="text-center mt-4 pt-2 border-top border-secondary">
                        <a href="{{ route('booking.index') }}" class="text-secondary text-decoration-none small">
                            <i class="fa-solid fa-arrow-left me-1"></i> Kembali ke Form Booking
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</body>
</html>`