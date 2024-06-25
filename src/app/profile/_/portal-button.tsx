'use client';

import { Button } from '@/common/_/ui/button';
import { useToast } from '@/common/_/ui/use-toast';
import { useSession } from 'next-auth/react';
import { createPortalSession } from './portal-action';

export default function PortalButton() {
  const { toast } = useToast();
  const session = useSession();

  const handleClick = async () => {
    try {
      if (session.status !== 'authenticated') {
        toast({
          title: 'Authentication missing!',
          variant: 'destructive',
        });
        return;
      }

      const { url } = await createPortalSession();

      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to create billing portal session!',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      Manage Billing
    </Button>
  );
}
