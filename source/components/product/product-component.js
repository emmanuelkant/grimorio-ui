import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';

import { omit } from '../../helpers';
import styles from './product.styl';

import Svg from '../svg';
import Button from '../button';
import Tooltip from '../tooltip';
import Panel from '../panel';

import { moneyFormat, shareOn, uniqueId, copyToClipboard } from '../../helpers';

class Product extends PureComponent {
  constructor() {
    super();
    this.state = {
      linkCopied: false,
      btnId: uniqueId('copybtn'),
    };

    this.handleCopy = this.handleCopy.bind(this);
  }

  static propTypes = {
    type: PropTypes.oneOf(['default', 'card']),
    btnText: PropTypes.string,
    onCopy: PropTypes.func,
    onGenerate: PropTypes.func,
    generateLoading: PropTypes.bool,
    copyValue: PropTypes.string,
    stage: PropTypes.oneOf(['generate', 'copy']),
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      img: PropTypes.string,
      info: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rules: PropTypes.string,
      }).isRequired,
      expires: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        })
      ),
    }),
  };

  static defaultProps = {
    type: 'default',
    btnText: 'Copiar Link',
    stage: 'generate',
    data: {},
    onCopy: value => value,
    generateLoading: false,
    copyValue: null,
  };

  share(type, link) {
    return () => shareOn[type](link);
  }

  renderInfo() {
    const { info } = this.props.data;

    if (!info) {
      return null;
    }

    return (
      <div className={cx(styles.info, { [styles.isBig]: info.value && info.value.length > 11 })}>
        {typeof info.value === 'number' ? moneyFormat(info.value) : info.value}
        {info.rules &&
          <Tooltip className={styles.rules} width="220px" message={info.rules}>
            <span className={styles.rulesIcon}>?</span>
          </Tooltip>}
      </div>
    );
  }

  renderTags() {
    const { tags } = this.props.data;

    if (!tags) {
      return null;
    }

    return tags.map(tag => {
      const key = `${tag.type}-${tag.value}`;
      switch (tag.type) {
        case 'brand':
          return <Svg key={key} width={48} height={48} src={`logo/${tag.value}`} />;
        case 'highlight':
          return tag.value && <Svg key={key} className={styles.tagHighlight} width={32} height={32} src="flame" />;
        default:
          return '';
      }
    });
  }

  handleCopy() {
    const { copyValue, onCopy } = this.props;
    copyToClipboard({
      value: copyValue,
      success: () => {
        onCopy(copyValue);
        this.setState({ linkCopied: true });
        setTimeout(() => {
          this.setState({ linkCopied: false });
        }, 2000);
      },
    });
  }

  renderGenerateButton() {
    const { generateLoading, onGenerate } = this.props;
    return (
      <Button
        size="small"
        className={styles.copy}
        onClick={onGenerate}
        loading={generateLoading}
        iconRight={!generateLoading && 'insert_link'}
        color="primary"
        modifier="outline"
      >
        Gerar Link
      </Button>
    );
  }

  renderCopyButton() {
    const { btnText } = this.props;
    const { linkCopied } = this.state;
    return (
      <Button
        size="small"
        className={styles.copy}
        onClick={this.handleCopy}
        iconRight={linkCopied ? 'check' : 'insert_link'}
      >
        {linkCopied && 'Copiado!'}
        {!linkCopied && btnText}
      </Button>
    );
  }

  renderProductContent() {
    const { stage, copyValue } = this.props;
    const { img, name, expires, link } = this.props.data;

    return (
      <Fragment>
        <div className={styles.tag}>
          {this.renderTags()}
        </div>

        <div className={styles.imgWrapper}>
          <a target="_blank" href={copyValue || link}>
            {img
              ? <img className={styles.imgCustom} src={img} alt={name} />
              : <Svg className={styles.imgDefault} src="cupom" />}
          </a>
        </div>

        <h1 className={cx(styles.name, { [styles.isShort]: name.length < 31 })}>
          <a href={copyValue || link}>
            {name}
          </a>
        </h1>

        {this.renderInfo()}

        <div className={styles.footer}>
          {expires &&
            <div className={styles.expires}>
              {`Valido até: ${moment(expires).utc().format('DD/MM/YYYY H:mm')}`}
            </div>}

          <div className={styles.social}>
            {stage === 'generate' ? this.renderGenerateButton() : this.renderCopyButton()}
            <Svg
              onClick={this.share('facebook', encodeURIComponent(copyValue || link))}
              className={styles.facebook}
              align="top"
              width={26}
              height={26}
              src="icon/facebook-square"
            />
            <Svg
              onClick={this.share('twitter', encodeURIComponent(copyValue || link))}
              className={styles.twitter}
              align="top"
              width={26}
              height={26}
              src="icon/twitter-square"
            />
          </div>
        </div>
      </Fragment>
    );
  }

  renderBrandHeader(brand) {
    return (
      <header className={styles[brand]}>
        <Svg className={styles.brandLogo} src={`logo/${brand}-full`} />
      </header>
    );
  }

  render() {
    const { className, type, brand, ...elementProps } = this.props;
    const { name, info, link } = this.props.data;

    const fullClassName = cx(className, styles.wrapper, {
      [styles[type]]: type,
    });

    const sendProps = omit(elementProps, ['btnText', 'onGenerate', 'generateLoading', 'copyValue']);

    if (!name || !link || !info) {
      return null;
    }

    if (type === 'card' && brand) {
      return (
        <Panel title={this.renderBrandHeader(brand)} contentClassName={fullClassName} size="no-padding" {...sendProps}>
          {this.renderProductContent()}
        </Panel>
      );
    }

    return (
      <section className={fullClassName} {...sendProps}>
        {this.renderProductContent()}
      </section>
    );
  }
}

export default Product;
