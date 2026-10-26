import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  guestName: Yup.string().trim().required('სტუმრის სახელი აუცილებელია.'),
  guests: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('შეიყვანე რიცხვი.')
    .integer('რაოდენობა უნდა იყოს მთელი რიცხვი.')
    .min(1, 'მინიმუმ 1 სტუმარი.')
    .max(30, 'მაქსიმუმ 30 სტუმარი.')
    .required('სტუმრების რაოდენობა აუცილებელია.'),
  email: Yup.string().trim().email('ელფოსტის ფორმატი არასწორია.').required('ელფოსტა აუცილებელია.'),
  roomType: Yup.string().required('აირჩიე ოთახის ტიპი.'),
  checkIn: Yup.string().required('აირჩიე შესვლის თარიღი.'),
  checkOut: Yup.string().required('აირჩიე გასვლის თარიღი.')
    .test('after-checkin', 'გასვლის თარიღი შესვლის თარიღზე გვიან უნდა იყოს.', function (value) {
      return !value || !this.parent.checkIn || value > this.parent.checkIn;
    }),
});

const initialValues = { guestName: '', guests: 1, email: '', roomType: 'Standard', checkIn: '', checkOut: '' };

export default function BookingForm({ onSubmit }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div><p className="eyebrow">ახალი ჩანაწერი</p><h2>ჯავშნის დამატება</h2></div>
        <button className="button button-dark" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span>{open ? '−' : '+'}</span> {open ? 'დახურვა' : 'ახალი ჯავშანი'}
        </button>
      </div>
      {open ? (
        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={(values, actions) => {
          onSubmit(values);
          actions.resetForm();
          setOpen(false);
        }}>
          {() => (
            <Form className="booking-form" noValidate>
              <label>სტუმრის სახელი
                <Field name="guestName" placeholder="მაგ. მარიამ გელაშვილი" />
                <ErrorMessage name="guestName" component="span" className="field-error" />
              </label>
              <div className="form-row">
                <label>სტუმრების რაოდენობა
                  <Field name="guests" type="number" min="1" max="30" />
                  <ErrorMessage name="guests" component="span" className="field-error" />
                </label>
                <label>ელფოსტა
                  <Field name="email" type="email" placeholder="name@example.com" />
                  <ErrorMessage name="email" component="span" className="field-error" />
                </label>
              </div>
              <label>ოთახის ტიპი
                <Field as="select" name="roomType">
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Family Suite">Family Suite</option>
                  <option value="Presidential">Presidential</option>
                </Field>
                <ErrorMessage name="roomType" component="span" className="field-error" />
              </label>
              <div className="form-row">
                <label>შესვლის თარიღი<Field name="checkIn" type="date" /><ErrorMessage name="checkIn" component="span" className="field-error" /></label>
                <label>გასვლის თარიღი<Field name="checkOut" type="date" /><ErrorMessage name="checkOut" component="span" className="field-error" /></label>
              </div>
              <div className="form-actions"><button className="button button-dark" type="submit">ჯავშნის შენახვა <span>↗</span></button></div>
            </Form>
          )}
        </Formik>
      ) : (
        <p className="form-description">შეავსე სტუმრის ინფორმაცია და დაამატე ახალი ჯავშანი სისტემაში.</p>
      )}
    </section>
  );
}