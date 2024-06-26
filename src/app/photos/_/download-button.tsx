'use client';

import { Button } from '@/common/_/ui/button';
import { useToast } from '@/common/_/ui/use-toast';

export function DownloadButton({ image }: { image: string }) {
  const { toast } = useToast();

  const handleDownload = async () => {
    const res = await fetch('/api/usage-meter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    });

    if (res.ok) {
      const { total_downloads } = await res.json();
      toast({
        title: `Success! You have downloaded ${total_downloads} images`,
      });
    } else {
      const err = await res.json();
      toast({
        title: `Error!`,
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload}>
      Download
    </Button>
  );
}
