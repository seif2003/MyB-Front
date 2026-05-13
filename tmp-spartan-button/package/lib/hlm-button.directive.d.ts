import { type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import * as i0 from "@angular/core";
export declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export declare class HlmButtonDirective {
    private readonly _config;
    private readonly _additionalClasses;
    readonly userClass: import("@angular/core").InputSignal<ClassValue>;
    protected readonly _computedClass: import("@angular/core").Signal<string>;
    readonly variant: import("@angular/core").InputSignal<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined>;
    readonly size: import("@angular/core").InputSignal<"default" | "sm" | "lg" | "icon" | null | undefined>;
    setClass(classes: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HlmButtonDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<HlmButtonDirective, "[hlmBtn]", ["hlmBtn"], { "userClass": { "alias": "class"; "required": false; "isSignal": true; }; "variant": { "alias": "variant"; "required": false; "isSignal": true; }; "size": { "alias": "size"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
