import os
import torch
import torch.distributed as dist

def main():
    # torchrun sets these
    local_rank = int(os.environ["LOCAL_RANK"])
    world_size = int(os.environ["WORLD_SIZE"])
    rank = int(os.environ["RANK"])

    torch.cuda.set_device(local_rank)
    dist.init_process_group(backend="nccl")

    # Each rank creates a tensor = its rank, then we all-reduce (sum)
    t = torch.tensor([float(rank)], device=local_rank)
    dist.all_reduce(t, op=dist.ReduceOp.SUM)

    # Print a small summary from each rank
    print(f"[Rank {rank}/{world_size}] on cuda:{local_rank} -> reduced sum = {t.item()}")

    dist.destroy_process_group()

if __name__ == "__main__":
    main()
