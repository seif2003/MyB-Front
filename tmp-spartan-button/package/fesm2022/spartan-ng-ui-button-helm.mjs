import * as i0 from '@angular/core';
import { InjectionToken, inject, signal, input, computed, Directive, NgModule } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { cva } from 'class-variance-authority';

const defaultConfig = {
    variant: 'default',
    size: 'default',
};
const BrnButtonConfigToken = new InjectionToken('BrnButtonConfig');
function provideBrnButtonConfig(config) {
    return { provide: BrnButtonConfigToken, useValue: { ...defaultConfig, ...config } };
}
function injectBrnButtonConfig() {
    return inject(BrnButtonConfigToken, { optional: true }) ?? defaultConfig;
}

const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'underline-offset-4 hover:underline text-primary',
        },
        size: {
            default: 'h-10 py-2 px-4',
            sm: 'h-9 px-3 rounded-md',
            lg: 'h-11 px-8 rounded-md',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
class HlmButtonDirective {
    constructor() {
        this._config = injectBrnButtonConfig();
        this._additionalClasses = signal('');
        this.userClass = input('', { alias: 'class' });
        this._computedClass = computed(() => hlm(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass(), this._additionalClasses()));
        this.variant = input(this._config.variant);
        this.size = input(this._config.size);
    }
    setClass(classes) {
        this._additionalClasses.set(classes);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "18.2.5", type: HlmButtonDirective, isStandalone: true, selector: "[hlmBtn]", inputs: { userClass: { classPropertyName: "userClass", publicName: "class", isSignal: true, isRequired: false, transformFunction: null }, variant: { classPropertyName: "variant", publicName: "variant", isSignal: true, isRequired: false, transformFunction: null }, size: { classPropertyName: "size", publicName: "size", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class": "_computedClass()" } }, exportAs: ["hlmBtn"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[hlmBtn]',
                    standalone: true,
                    exportAs: 'hlmBtn',
                    host: {
                        '[class]': '_computedClass()',
                    },
                }]
        }] });

class HlmButtonModule {
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    /** @nocollapse */ static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonModule, imports: [HlmButtonDirective], exports: [HlmButtonDirective] }); }
    /** @nocollapse */ static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: HlmButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [HlmButtonDirective],
                    exports: [HlmButtonDirective],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { HlmButtonDirective, HlmButtonModule, buttonVariants, injectBrnButtonConfig, provideBrnButtonConfig };
//# sourceMappingURL=spartan-ng-ui-button-helm.mjs.map
