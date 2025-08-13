import torch
import torch.nn as nn

def main():
    n_gpus = torch.cuda.device_count()
    print(f"CUDA available: {torch.cuda.is_available()}  |  GPUs: {n_gpus}")
    for i in range(n_gpus):
        print(f"  GPU {i}: {torch.cuda.get_device_name(i)}")

    if n_gpus < 2:
        print("Need >= 2 GPUs for a multi-GPU test. Exiting.")
        return

    # Tiny model and dummy batch (batch size > #GPUs so it actually splits)
    model = nn.Sequential(nn.Linear(1024, 1024), nn.ReLU(), nn.Linear(1024, 10))
    model = nn.DataParallel(model).cuda()

    x = torch.randn(64, 1024, device="cuda")  # big enough batch to split
    with torch.no_grad():
        y = model(x)

    print("Forward pass OK. Output shape:", tuple(y.shape))
    # Show where the first and last module replicas live
    for i, m in enumerate(model.module.children()):
        print(f"  Module {i} is replicated on GPUs: {list(model.device_ids)}")

if __name__ == "__main__":
    main()
