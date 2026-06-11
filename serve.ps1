$port = 3000
$root = "C:\Users\p2trix\Desktop\portfolio"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$port/")
$listener.Start()
Write-Host "Server at http://192.168.0.221:$port"
Write-Host "Press Ctrl+C to stop"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = $ctx.Request.Url.LocalPath.TrimStart('/')
  if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }
  $full = Join-Path $root $path
  if (Test-Path $full) {
    $ctx.Response.ContentType = switch ([System.IO.Path]::GetExtension($full)) {
      '.html' { 'text/html' }
      '.css'  { 'text/css' }
      '.js'   { 'application/javascript' }
      '.png'  { 'image/png' }
      '.jpg'  { 'image/jpeg' }
      '.svg'  { 'image/svg+xml' }
      '.ico'  { 'image/x-icon' }
      default { 'application/octet-stream' }
    }
    [byte[]]$data = [System.IO.File]::ReadAllBytes($full)
    $ctx.Response.OutputStream.Write($data, 0, $data.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
