#!/usr/bin/env bash
set -u

section() { echo -e "\n===== $1 ====="; }

section "Host"
echo "User: $(whoami)"
echo "Host: $(hostname)"
echo "Date: $(date)"

section "OS / Kernel"
if [ -f /etc/os-release ]; then
  . /etc/os-release
  echo "OS: ${NAME} ${VERSION}"
else
  echo "/etc/os-release not found"
fi
uname -a

section "CPU"
if command -v lscpu >/dev/null 2>&1; then
  lscpu | egrep 'Architecture|Model name|Socket|Core|Thread|CPU\(s\)'
else
  grep -m1 'model name' /proc/cpuinfo || true
fi

section "RAM"
if command -v free >/dev/null 2>&1; then
  free -h
else
  awk '/MemTotal|MemFree|MemAvailable/ {print}' /proc/meminfo || true
fi

section "GPU (NVIDIA)"
if command -v nvidia-smi >/dev/null 2>&1; then
  echo "-- Summary --"
  nvidia-smi --query-gpu=index,name,driver_version,compute_cap,memory.total,memory.used,memory.free --format=csv,noheader
  echo "-- nvidia-smi topo --"
  nvidia-smi -L
  echo "-- CUDA nvcc --"
  (nvcc --version 2>/dev/null || echo "nvcc not found")
else
  echo "nvidia-smi not found or no NVIDIA GPU detected."
fi

section "Storage"
df -h / 2>/dev/null || true
[ -n "${TMPDIR:-}" ] && df -h "$TMPDIR" 2>/dev/null || true
