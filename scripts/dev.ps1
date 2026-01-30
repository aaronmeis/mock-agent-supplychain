function Show-Help {
    Write-Host "S&OP Agent System - Developer Utility Script" -ForegroundColor Cyan
    Write-Host "Usage: ./dev.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  up        Start all services in detached mode"
    Write-Host "  down      Stop all services"
    Write-Host "  rebuild   Rebuild and restart all services"
    Write-Host "  logs      View real-time logs for all services"
    Write-Host "  clean     Remove all containers and volumes"
    Write-Host "  help      Show this help message"
}

$command = $args[0]

switch ($command) {
    "up" {
        Write-Host "🚀 Starting services..." -ForegroundColor Green
        docker-compose up -d
    }
    "down" {
        Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
        docker-compose down
    }
    "rebuild" {
        Write-Host "🔄 Rebuilding and restarting..." -ForegroundColor Cyan
        docker-compose up --build -d
    }
    "logs" {
        Write-Host "📋 Showing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    "clean" {
        Write-Host "🧹 Cleaning up everything..." -ForegroundColor Red
        docker-compose down -v --rmi all
    }
    default {
        Show-Help
    }
}
