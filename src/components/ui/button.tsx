
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Enhanced accessibility checks
    if (process.env.NODE_ENV !== 'production') {
      // Check for either:
      // 1. aria-label attribute
      // 2. aria-labelledby attribute 
      // 3. visible text content
      // 4. title attribute
      const missingAccessibleName = 
        !props['aria-label'] && 
        !props['aria-labelledby'] && 
        (!props.children || typeof props.children === 'object') &&
        !props.title;
        
      if (!asChild && missingAccessibleName) {
        console.warn('Button is missing an accessible name. Add one of: aria-label, aria-labelledby, text content, or title attribute for accessibility.')
      }
    }
    
    // If we have an icon button with no accessible name, add a title based on context
    if (size === 'icon' && !props['aria-label'] && !props.title && !asChild) {
      // Icon buttons require an accessible name 
      props.title = typeof props.children === 'string' 
        ? props.children 
        : props.title || 'Button';
      
      if (!props['aria-label']) {
        props['aria-label'] = props.title;
      }
    }
    
    // IE-specific compatibility attribute
    const ieAttributes = {
      // Add MS-specific touch action for IE
      style: {
        '-ms-touch-action': 'manipulation',
        'touch-action': 'manipulation',
      } as React.CSSProperties
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...ieAttributes}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
