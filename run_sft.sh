#!/usr/bin/env bash
set -u

# 1) pick a fast local dir on the exec host
LOCAL_BASE="${GPU_tmp:-/tmp/$USER/$LSB_JOBID}"
TRITON_CACHE_DIR="$LOCAL_BASE/triton_cache"
CUDA_CACHE_PATH="$LOCAL_BASE/cuda_cache"
TORCHINDUCTOR_CACHE_DIR="$LOCAL_BASE/inductor_cache"
HF_HOME="$LOCAL_BASE/hf_cache"
TRANSFORMERS_CACHE="$HF_HOME/transformers"

mkdir -p "$TRITON_CACHE_DIR" "$CUDA_CACHE_PATH" "$TORCHINDUCTOR_CACHE_DIR" "$HF_HOME" "$TRANSFORMERS_CACHE"

export TRITON_CACHE_DIR CUDA_CACHE_PATH TORCHINDUCTOR_CACHE_DIR HF_HOME TRANSFORMERS_CACHE

# 2) (optional) stage your dataset locally for faster I/O
#    Set DATASET_SRC to your real path or pass it via env
if [[ -n "${DATASET_SRC:-}" ]]; then
  DATASET_LOCAL="$LOCAL_BASE/dataset"
  mkdir -p "$DATASET_LOCAL"
  # Use rsync if available; fall back to cp -a
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$DATASET_SRC"/ "$DATASET_LOCAL"/
  else
    cp -a "$DATASET_SRC"/. "$DATASET_LOCAL"/
  fi
  export DATASET_LOCAL
  echo "Staged dataset to: $DATASET_LOCAL"
fi

echo "TRITON_CACHE_DIR=$TRITON_CACHE_DIR"
echo "CUDA_CACHE_PATH=$CUDA_CACHE_PATH"
echo "TORCHINDUCTOR_CACHE_DIR=$TORCHINDUCTOR_CACHE_DIR"
echo "HF_HOME=$HF_HOME"
echo "TRANSFORMERS_CACHE=$TRANSFORMERS_CACHE"

# 3) run your finetune script (add your args as needed)
python sft_train.py "$@"
