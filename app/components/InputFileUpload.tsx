// components/InputFileUpload.tsx
'use client';

import * as React from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface Props {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export default function InputFileUpload({ label, onChange, accept = 'image/*' }: Props) {
  return (
    <Button
      component="label"
      variant="outlined"
      startIcon={<CloudUploadIcon />}
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onChange(file);
        }}
      />
    </Button>
  );
}