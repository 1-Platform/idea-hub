import { FlexItem, Button, ButtonProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

export const CommentButton = ({ children, className, ...props }: ButtonProps): JSX.Element => {
  return (
    <FlexItem>
      <Button
        variant="plain"
        {...props}
        className={css('pf-u-p-0 pf-u-font-size-xs pf-u-font-weight-bold', className)}
      >
        {children}
      </Button>
    </FlexItem>
  );
};
