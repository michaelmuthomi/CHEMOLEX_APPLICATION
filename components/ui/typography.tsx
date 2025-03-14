import * as Slot from '@rn-primitives/slot';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Platform, Text as RNText } from 'react-native';
import { cn } from '~/lib/utils';

const H1 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="1"
        className={cn(
          "web:scroll-m-20 text-3xl tracking-tight lg:text-5xl web:select-text",
          className
        )}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_700Bold" }}
      />
    );
  }
);

H1.displayName = "H1";

const H2 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="2"
        className={cn(
          "web:scroll-m-20 border-b border-border pb-2 text-3xl text-white font-semibold tracking-tight first:mt-0 web:select-text",
          className
        )}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_700Bold" }}
      />
    );
  }
);

H2.displayName = 'H2';

const H3 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="3"
        className={cn(
          "web:scroll-m-20 text-2xl text-white font-semibold tracking-tight web:select-text",
          className
        )}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_600SemiBold" }}
      />
    );
  }
);

H3.displayName = "H3";

const H4 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="4"
        className={cn(
          "web:scroll-m-20 text-xl font-semibold tracking-tight web:select-text",
          className
        )}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_500Medium" }}
      />
    );
  }
);

H4.displayName = 'H4';

const H5 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="4"
        className={cn(
          "web:scroll-m-20 text-base text-white tracking-normal leading-4 web:select-text",
          className
        )}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_600SemiBold" }}
      />
    );
  }
);

H5.displayName = "H5";

const H6 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        role="heading"
        aria-level="4"
        className={cn(
          "web:scroll-m-20 text-white tracking-wide leading-4 web:select-text",
          className
        )}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_300Light" }}
      />
    );
  }
);

H6.displayName = "H6";

const P = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn("web:select-text", className)}
        ref={ref}
        {...props}
        style={{ fontFamily: "Inter_400Regular" }}
      />
    );
  }
);
P.displayName = 'P';

const BlockQuote = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        // @ts-ignore - role of blockquote renders blockquote element on the web
        role={Platform.OS === "web" ? "blockquote" : undefined}
        className={cn(
          "mt-6 native:mt-4 border-l-2 border-border pl-6 native:pl-3 text-base text-white italic web:select-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

BlockQuote.displayName = 'BlockQuote';

const Code = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        // @ts-ignore - role of code renders code element on the web
        role={Platform.OS === "web" ? "code" : undefined}
        className={cn(
          "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] text-sm text-white font-semibold web:select-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Code.displayName = 'Code';

const Lead = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn("text-xl text-muted-white web:select-text", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Lead.displayName = 'Lead';

const Large = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-xl text-white font-semibold web:select-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Large.displayName = 'Large';

const Small = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn(
          "text-sm text-white font-medium leading-none web:select-text",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Small.displayName = 'Small';

const Muted = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return (
      <Component
        className={cn("text-sm text-muted-white web:select-text", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Muted.displayName = 'Muted';

export { BlockQuote, Code, H1, H2, H3, H4, H5, H6, Large, Lead, Muted, P, Small };
