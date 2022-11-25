import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageList } from '@app/modules/support/store/support.reducer';

@Component({
    selector: 'app-inquiry',
    templateUrl: './inquiry.component.html',
    styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {

    inquiryForm: FormGroup;
    submitted = false;

    @Output() postInquiry = new EventEmitter<{ title: string, content: string }>();

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.inquiryForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.inquiryForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.inquiryForm.invalid) {
            return;
        }
        this.postInquiry.emit({
            title: this.inquiryForm.controls.title.value,
            content: this.inquiryForm.controls.content.value,
        });
        this.inquiryForm.reset();
        this.submitted = false;
    }

}
