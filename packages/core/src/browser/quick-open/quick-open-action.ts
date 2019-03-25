/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
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

import { Disposable } from '../../common/disposable';
import { injectable, unmanaged } from 'inversify';

export interface Action extends Disposable {
    id: string;
    label: string;
    tooltip: string;
    class: string | undefined;
    enabled: boolean;
    checked: boolean;
    radio: boolean;
    // tslint:disable-next-line:no-any
    run(event?: any): PromiseLike<any>;
}

export interface ActionRunner extends Disposable {
    // tslint:disable-next-line:no-any
    run(action: Action, context?: any): PromiseLike<any>;
}

export interface ActionItem extends Disposable {
    actionRunner: ActionRunner;
    // tslint:disable-next-line:no-any
    setActionContext(context: any): void;
    // tslint:disable-next-line:no-any
    render(element: any /* HTMLElement */): void;
    isEnabled(): boolean;
    focus(): void;
    blur(): void;
}

export interface ActionProvider {
    // tslint:disable-next-line:no-any
    hasActions(element: any): boolean;
    // tslint:disable-next-line:no-any
    getActions(element: any): Promise<Action[]>;
    // tslint:disable-next-line:no-any
    hasSecondaryActions(element: any): boolean;
    // tslint:disable-next-line:no-any
    getSecondaryActions(element: any): Promise<Action[]>;
    // tslint:disable-next-line:no-any
    getActionItem(element: any, action: Action): ActionItem;
}

@injectable()
export class NoActionProvider implements ActionProvider {
    hasActions(): boolean {
        return false;
    }
    async getActions(): Promise<Action[]> {
        return [];
    }

    hasSecondaryActions(): boolean {
        return false;
    }

    async getSecondaryActions(): Promise<Action[]> {
        return [];
    }

    getActionItem(): ActionItem {
        throw new Error('Method is not implemented.');
    }
}

@injectable()
export abstract class BaseAction implements Action {
    protected actionId: string;
    protected actionLabel: string;
    protected actionTooltip: string;
    protected actionCssClass: string | undefined;
    protected actionEnabled: boolean;
    protected actionChecked: boolean;
    protected actionRadio: boolean;
    // tslint:disable-next-line:no-any
    protected callback?: (event?: any) => Promise<any>;

    constructor(
        @unmanaged() id: string,
        @unmanaged() label: string = '',
        @unmanaged() cssClass: string = '',
        @unmanaged() enabled: boolean = true,
        // tslint:disable-next-line:no-any
        @unmanaged() actionCallback?: (event?: any) => Promise<any>) {
        this.actionId = id;
        this.actionLabel = label;
        this.actionCssClass = cssClass;
        this.actionEnabled = enabled;
        this.callback = actionCallback;
    }

    get id(): string {
        return this.actionId;
    }

    get label(): string {
        return this.actionLabel;
    }

    set label(value: string) {
        this.actionLabel = value;
    }

    get tooltip(): string {
        return this.actionTooltip;
    }

    set tooltip(value: string) {
        this.tooltip = value;
    }

    get class(): string | undefined {
        return this.actionCssClass;
    }

    set class(value: string | undefined) {
        this.actionCssClass = value;
    }

    get enabled(): boolean {
        return this.actionEnabled;
    }

    set enabled(value: boolean) {
        this.actionEnabled = value;
    }

    get checked(): boolean {
        return this.actionChecked;
    }

    set checked(value: boolean) {
        this.actionChecked = value;
    }

    get radio(): boolean {
        return this.actionRadio;
    }

    set radio(value: boolean) {
        this.actionRadio = value;
    }

    // tslint:disable-next-line:no-any
    async run(event?: any): Promise<any> {
        if (this.callback) {
            return this.callback(event);
        }
        return true;
    }

    dispose(): void { }
}
