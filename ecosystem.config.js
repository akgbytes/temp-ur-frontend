module.exports = {
  apps: [
    {
      name: "urbanesta-frontend",
      script: "server.js", 
      cwd: process.cwd(),
      // Production environment only
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        BACKEND_URL: "http://10.0.2.144:80",
        NEXT_PUBLIC_BACKEND_URL: "http://10.0.2.144:80"
      },
      
      // PM2 configuration
      instances: 1,
      exec_mode: "fork",
      watch: false,
      
      // Memory Management
      max_memory_restart: "800M",  // Reduced to prevent hitting limits
      node_args: "--max-old-space-size=768",  // Add Node.js memory limit
      
      // Logging with better management
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,
      
      // Restart configuration - CRITICAL FIX
      autorestart: true,  // Explicitly enable auto-restart
      min_uptime: "10s",  // Process must stay up 10s to be considered stable
      max_restarts: 999999,  // Never stop trying (was 10 - prevents auto-deletion)
      restart_delay: 4000,  // Wait 4s between restarts
      exp_backoff_restart_delay: 100,  // Exponential backoff
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Process management
      kill_timeout: 5000,
      listen_timeout: 3000,
      wait_ready: true,  // Wait for app to signal ready
      
      // Prevent log deletion
      delete_err_log: false,
      delete_out_log: false,
      
      // Auto restart on file changes (disabled for production)
      ignore_watch: ["node_modules", "logs", ".git", ".next"],
    }
  ]
};
