import { FlexItem, Button as BaseButton, ButtonProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

export const Button = ({ children, className, ...props }: ButtonProps): JSX.Element => {
  return (
    <FlexItem>
      <BaseButton
        variant="plain"
        {...props}
        className={css('pf-u-p-0 pf-u-font-weight-light', className)}
      >
        {children}
      </BaseButton>
    </FlexItem>
  );
};
