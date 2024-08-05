'use client'
import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '../../lib/utils'
interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  name: string;
}
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, name, ...props }, ref) => {
  const initials = getInitials(name);
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Fallback className={cn(
        'flex items-center justify-center h-full w-full rounded-full bg-gray-200 text-gray-600 text-xs font-semibold',
        className
      )}>
        {initials}
      </AvatarPrimitive.Fallback>
      {/* Optionally, you can include an AvatarImage component here */}
      {/* <AvatarImage src={avatarSrc} alt='Avatar Image' /> */}
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;
// Utility function to get initials from name
function getInitials(name: string) {
  const parts = name.split(' ');
  const initials = parts.map(part => part[0]).join('');
  return initials.toUpperCase();
}
// AvatarImage and AvatarFallback remain unchanged from your original code
export default { Avatar };