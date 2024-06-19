"use client";
import React, { useContext } from 'react'
import { ModalContext } from '@/components/modals/providers';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlayButtonIFrame = () => {
  const { setShowIFrameModal } = useContext(ModalContext);
  return (
    <Button variant="default" className='size-20 rounded-full' onClick={() => setShowIFrameModal(true)}>
      <PlayCircle className="size-10" />
    </Button>
  )
}

export default PlayButtonIFrame