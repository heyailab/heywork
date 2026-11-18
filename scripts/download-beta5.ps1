# Windows 下载 UMA beta5 安装包（GitHub 私有仓库 Release）
#
# 用法：
#   1. 用你的 GitHub token（就是 Mac 上 ~/.github-token 那个，需 repo 权限）
#   2. 打开 PowerShell， cd 到想保存的目录
#   3. 执行：  .\download-beta5.ps1
#   4. 按提示粘贴 token（或直接设环境变量 $env:GITHUB_TOKEN）
#
# 说明：仓库是私有的，浏览器直接打开 Release 链接会 404。
#       本脚本走 GitHub API 资产端点（带 token），会重定向到带签名的 CDN 地址下载。

$ErrorActionPreference = "Stop"

$Owner  = "heyailab"
$Repo   = "uma-window"
$Tag    = "uma-beta5-archive"
$Asset  = "uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip"
$Out    = Join-Path (Get-Location) $Asset
$ExpectedBytes = 420140017
$ExpectedSha256 = "d79a560cfef0d12d6be3bf32ccad87c8f00e37db269be6feeb2cfe6c6b8e55c4"

# --- token ---
$token = $env:GITHUB_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
    $token = Read-Host -Prompt "请输入 GitHub token (ghp_...)" -AsSecureString
    $token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))
}
if ([string]::IsNullOrWhiteSpace($token)) { Write-Error "token 不能为空"; exit 1 }

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "heywork-beta5-downloader"
}

Write-Host "查询 Release 资产..."
$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/releases/tags/$Tag" -Headers $headers
$assetObj = $release.assets | Where-Object { $_.name -eq $Asset }
if ($null -eq $assetObj) { Write-Error "未找到资产 $Asset"; exit 1 }
Write-Host ("资产 id: {0}, 大小: {1:N0} 字节" -f $assetObj.id, $assetObj.size)

if (Test-Path $Out) {
    $cur = (Get-Item $Out).Length
    if ($cur -eq $ExpectedBytes) {
        Write-Host "文件已存在且大小正确，跳过下载: $Out"
    } else {
        Write-Host ("已存在文件但大小不符 ({0:N0})，将覆盖" -f $cur)
        Remove-Item $Out -Force
    }
}

if (-not (Test-Path $Out)) {
    Write-Host "开始下载（420MB，可能需要几分钟）..."
    $apiUrl = "https://api.github.com/repos/$Owner/$Repo/releases/assets/$($assetObj.id)"
    $dlHeaders = @{
        "Authorization" = "Bearer $token"
        "Accept"        = "application/octet-stream"
        "User-Agent"    = "heywork-beta5-downloader"
    }
    Invoke-WebRequest -Uri $apiUrl -Headers $dlHeaders -OutFile $Out -TimeoutSec 1800
}

# --- 校验 ---
$size = (Get-Item $Out).Length
Write-Host ("下载完成，大小: {0:N0} 字节" -f $size)
if ($size -ne $ExpectedBytes) {
    Write-Warning ("大小不符！期望 {0:N0}，实际 {1:N0}" -f $ExpectedBytes, $size)
} else {
    Write-Host "大小校验: OK"
}
Write-Host "计算 SHA-256 中..."
$sha = (Get-FileHash $Out -Algorithm SHA256).Hash.ToLower()
if ($sha -eq $ExpectedSha256) {
    Write-Host "SHA-256 校验: OK"
} else {
    Write-Warning "SHA-256 不符！期望 $ExpectedSha256，实际 $sha"
}
Write-Host "文件位置: $Out"
