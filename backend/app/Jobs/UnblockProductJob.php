<?php

namespace App\Jobs;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UnblockProductJob implements ShouldQueue
{
    use Queueable;

    private Product $product;
    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->product->blocked_at = null;
        $this->product->in_user_id_cart = null;
        $this->unblocked_at = Carbon::now('Europe/Paris');
        $this->product->update(['blocked_at' => $this->product->blocked_at, 'in_user_id_cart' => $this->product->in_user_id_cart, 'unblocked_at' => $this->product->unblocked_at]);
        $this->product->save();
    }
}
