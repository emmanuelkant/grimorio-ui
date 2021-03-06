import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// components
import Icon from '../../icon';
import { fieldsValidation } from '../../../helpers/validation';
import { omit } from '../../../helpers';

import { withContext } from '../form-context';

import Select from '../../select';

// styles
import styles from '../form.styl';

class FormControl extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.value,
    };

    this.type = this.props.type;
    this.hasTypeProperty = this.type !== 'select' && this.type !== 'textarea';

    this.componentRender = this.componentRender.bind(this);
  }

  static defaultProps = {
    disabled: false,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    feedback: false,
    type: 'text',
    outline: false,
    theme: 'primary',
  };

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onMask: PropTypes.func,
    disabled: PropTypes.bool,
    getRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    checked: PropTypes.bool,
    feedback: PropTypes.bool,
    outline: PropTypes.bool,
    theme: PropTypes.oneOf(['primary', 'secondary']),
    type: PropTypes.oneOf([
      'text',
      'password',
      'textarea',
      'radio',
      'checkbox',
      'file',
      'hidden',
      'search',
      'email',
      'range',
      'number',
      'month',
      'tel',
      'time',
      'url',
      'week',
      'date',
      'datetime',
      'color',
      'select',
    ]),
  };

  static feedbackRender(validationState, feedback, addonAfter) {
    if ((!validationState && !feedback && addonAfter) || !feedback || !validationState) {
      return null;
    }

    const iconMap = {
      success: 'check',
      warning: 'warning',
      error: 'close',
    };

    const iconName = iconMap[validationState];

    return (
      <span className={styles['form-feedback']}>
        <Icon name={iconName} />
      </span>
    );
  }

  valueModifier(event, onMask, onChange, validate, onValidate) {
    const { value } = event.target;

    const validation = () => {
      if (validate && onValidate) {
        onValidate(fieldsValidation(this.state.value, this.props.validate));
      }
    };

    this.setState({ value: onMask ? onMask(value) : value }, validation());

    if (onChange) {
      onChange(event);
    }
  }

  componentRender(controlId, type) {
    const Component = this.hasTypeProperty ? 'input' : type;
    const {
      getRef,
      onChange,
      onFocus,
      onBlur,
      disabled,
      children,
      name,
      id,
      onMask,
      placeholder,
      inputClassName,
      validate,
      onValidate,
      outline,
      active,
      ...rest
    } = this.props;

    const isClassDefault = ['radio', 'checkbox', 'textarea'].indexOf(type) < 0;
    const componentClass = classNames(
      {
        [styles['form-field']]: isClassDefault,
        [styles['form-field--radio']]: type === 'radio',
        [styles['form-field--checkbox']]: type === 'checkbox',
        [styles['form-field--textarea']]: type === 'textarea',
        [styles['form-field--select']]: type === 'select',
        [styles['form-field--outline']]: outline,
        [styles.isActive]: active,
      },
      inputClassName
    );

    const handleChange = onMask || validate
      ? e => this.valueModifier(e, onMask, onChange, validate, onValidate)
      : onChange;

    if (type === 'select') {
      return (
        <Select
          className={componentClass}
          disabled={disabled}
          placeholder={placeholder}
          onSelect={handleChange}
          {...omit(rest, ['feedback', 'className'])}
        >
          {children}
        </Select>
      );
    } else if (['radio', 'checkbox'].indexOf(type) !== -1) {
      return (
        <div className={componentClass}>
          <Component
            type={type}
            ref={getRef}
            placeholder={placeholder}
            id={id}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            name={name}
            value={this.state.value}
            {...omit(rest, ['feedback', 'className', 'context'])}
          />
          <label
            className={classNames(styles.fakeInput, {
              [styles.isDisabled]: disabled,
              [styles.isActive]: this.props.checked,
              [styles.isPrimary]: this.props.theme === 'primary',
            })}
            htmlFor={id}
          >
            {type === 'checkbox' &&
              <Icon
                size={16}
                className={classNames(styles.checkIcon, { [styles.isChecked]: this.props.checked })}
                name="check"
              />}
          </label>
        </div>
      );
    } else {
      return (
        <Component
          type={type}
          ref={getRef}
          className={componentClass}
          placeholder={placeholder}
          id={controlId}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          name={name}
          value={this.state.value}
          {...omit(rest, ['feedback', 'className', 'context'])}
        >
          {children}
        </Component>
      );
    }
  }

  render() {
    const { type, addonBefore, addonAfter, feedback, className, context } = this.props;
    // context
    const { validationState, controlId } = context.formGroup;

    // styles
    const addonClass = classNames(className, styles['form-addon'], styles['form-field-wrapper'], {
      [styles['form-addon--withItens']]: addonBefore || addonAfter || feedback,
      [styles[`has-${validationState}`]]: validationState,
    });

    // internal components
    const generateFeedback = FormControl.feedbackRender(validationState, feedback, addonAfter);

    // component
    const generateComponent = this.componentRender(controlId, type);

    return (
      <div className={addonClass}>
        {generateComponent}
        {generateFeedback}
      </div>
    );
  }
}

export default withContext(FormControl);
