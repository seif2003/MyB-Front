import * as i0 from '@angular/core';
import { signal, Directive } from '@angular/core';

class BrnFormFieldControl {
    constructor() {
        /** Gets the AbstractControlDirective for this control. */
        this.ngControl = null;
        /** Whether the control is in an error state. */
        this.errorState = signal(false);
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: BrnFormFieldControl, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    /** @nocollapse */ static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.5", type: BrnFormFieldControl, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: BrnFormFieldControl, decorators: [{
            type: Directive
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { BrnFormFieldControl };
//# sourceMappingURL=spartan-ng-ui-formfield-brain.mjs.map
