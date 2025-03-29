
import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Check if we're in an IE environment
  const isIE = typeof window !== 'undefined' && 
    /*@cc_on!@*/false || !!(document as any).documentMode;
  
  // For IE, use a custom implementation since AspectRatio component might not work well
  if (isIE) {
    return (
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`relative ${className || ''}`}
        style={{ ...props.style }}
      >
        <div
          className="aspect-ratio-spacer"
          style={{
            paddingBottom: `${(1 / (props.ratio || 1)) * 100}%`,
            width: '100%',
            height: 0,
          }}
        />
        <div
          className="aspect-ratio-content"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {props.children}
        </div>
      </div>
    );
  }
  
  // For modern browsers, use the Radix component
  return <AspectRatioPrimitive.Root ref={ref} className={className} {...props} />;
});

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
