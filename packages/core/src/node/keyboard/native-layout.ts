/********************************************************************************
 * Copyright (C) 2019 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import * as nativeKeymap from 'native-keymap';
import { injectable } from 'inversify';
import { KeyboardLayoutProvider, NativeKeyboardLayout, KeyboardLayoutClient } from '../../common/keyboard/layout-provider';

@injectable()
export class NativeKeyboardLayoutProvider implements KeyboardLayoutProvider {

    protected client?: KeyboardLayoutClient;
    private registered = false;

    setClient(client?: KeyboardLayoutClient): void {
        this.client = client;
    }

    protected register(): void {
        nativeKeymap.onDidChangeKeyboardLayout(() => {
            if (this.client) {
                this.client.onNativeLayoutChanged(this.getNativeLayoutSync());
            }
        });
    }

    dispose(): void {
    }

    getNativeLayout(): Promise<NativeKeyboardLayout> {
        if (!this.registered) {
            this.register();
            this.registered = true;
        }
        return Promise.resolve(this.getNativeLayoutSync());
    }

    protected getNativeLayoutSync(): NativeKeyboardLayout {
        return {
            info: nativeKeymap.getCurrentKeyboardLayout(),
            mapping: nativeKeymap.getKeyMap()
        };
    }

}
