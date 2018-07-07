/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppConfigService, StorageService, SettingsService } from '@alfresco/adf-core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import { appLanguagePicker, selectHeaderColor, selectAppName } from '../../store/selectors/app.selectors';
import { MatCheckboxChange } from '@angular/material';
import { SetLanguagePickerAction } from '../../store/actions';

@Component({
    selector: 'aca-settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'aca-settings' }
})
export class SettingsComponent implements OnInit {

    private defaultPath = '/assets/images/alfresco-logo-white.svg';

    form: FormGroup;

    appName$: Observable<string>;
    headerColor$: Observable<string>;
    languagePicker$: Observable<boolean>;
    libraries: boolean;
    comments: boolean;
    cardview: boolean;
    share: boolean;
    extensions: boolean;

    constructor(
        private store: Store<AppStore>,
        private appConfig: AppConfigService,
        private settingsService: SettingsService,
        private storage: StorageService,
        private fb: FormBuilder) {
            this.appName$ = store.select(selectAppName);
            this.languagePicker$ = store.select(appLanguagePicker);
            this.headerColor$ = store.select(selectHeaderColor);
        }

    get logo() {
        return this.appConfig.get('application.logo', this.defaultPath);
    }

    ngOnInit() {
        this.form = this.fb.group({
            ecmHost: ['', [Validators.required, Validators.pattern('^(http|https):\/\/.*[^/]$')]]
        });

        this.reset();

        const libraries = this.appConfig.get('experimental.libraries');
        this.libraries = (libraries === true || libraries === 'true');

        const comments = this.appConfig.get('experimental.comments');
        this.comments = (comments === true || comments === 'true');

        const cardview = this.appConfig.get('experimental.cardview');
        this.cardview = (cardview === true || cardview === 'true');

        const share = this.appConfig.get('experimental.share');
        this.share = (share === true || share === 'true');

        const extensions = this.appConfig.get('experimental.extensions');
        this.extensions = (extensions === true || extensions === 'true');
    }

    apply(model: any, isValid: boolean) {
        if (isValid) {
            this.storage.setItem('ecmHost', model.ecmHost);
            // window.location.reload(true);
        }
    }

    reset() {
        this.form.reset({
            ecmHost: this.storage.getItem('ecmHost') || this.settingsService.ecmHost
        });
    }

    onLanguagePickerValueChanged(event: MatCheckboxChange) {
        this.storage.setItem('languagePicker', event.checked.toString());
        this.store.dispatch(new SetLanguagePickerAction(event.checked));
    }

    onChangeLibrariesFeature(event: MatCheckboxChange) {
        this.storage.setItem('experimental.libraries', event.checked.toString());
    }

    onChangeCommentsFeature(event: MatCheckboxChange) {
        this.storage.setItem('experimental.comments', event.checked.toString());
    }

    onChangeCardviewFeature(event: MatCheckboxChange) {
        this.storage.setItem('experimental.cardview', event.checked.toString());
    }

    onChangeShareFeature(event: MatCheckboxChange) {
        this.storage.setItem('experimental.share', event.checked.toString());
    }

    onChangeExtensionsFeature(event: MatCheckboxChange) {
        this.storage.setItem('experimental.extensions', event.checked.toString());
    }
}