import { useEffect } from 'react';
import {
  Button,
  FormGroup,
  Stack,
  StackItem,
  TextInput,
  TextArea,
  Split,
  SplitItem,
  Select,
  SelectOption,
  SelectVariant,
  Form,
} from '@patternfly/react-core';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWR from 'swr';

import { useFormSelect } from 'hooks';
import { tagDoc } from 'pouchDB';
import { CreateNewIdea } from 'pages/HomePage/types';
import { CreateIdeaDoc, IdeaDoc } from 'pouchDB/types';
import { reqErrorMsg } from 'utils/errorMessages';

interface Props {
  handleModalClose: () => void;
  handleCreateOrUpdateIdeaDoc: (
    data: CreateIdeaDoc,
    createdTags: string[],
    isUpdate: boolean
  ) => Promise<void>;
  updateDefaultValue?: IdeaDoc;
}

const IdeaFormValidator = yup.object({
  title: yup.string().trim().max(250).required(reqErrorMsg('Title')),
  description: yup.string().trim().max(500).required(reqErrorMsg('Description')),
  tags: yup.array(
    yup.object({
      name: yup.string().trim().required(reqErrorMsg('Tag Name')),
    })
  ),
});

export const IdeaCreateUpdateContainer = ({
  handleModalClose,
  handleCreateOrUpdateIdeaDoc,
  updateDefaultValue,
}: Props): JSX.Element => {
  const { data: tags, error } = useSWR('/tags', async () => {
    try {
      const tags = await tagDoc.getTagList(1000);
      return tags.docs.map((el) => el._id);
    } catch (error) {
      window.OpNotification.danger({ subject: 'Fetching tag failed' });
    }
    return [];
  });
  // form handling hooks
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateNewIdea>({ resolver: yupResolver(IdeaFormValidator) });

  const isUpdate = Boolean(updateDefaultValue?._rev);
  const isLoading = !error && !tags;

  const { selectIsOpen, onToggle, selections, handleSelect, onClear, onCreate, createdSelect } =
    useFormSelect({
      control,
      name: 'tags',
    });

  useEffect(() => {
    if (updateDefaultValue) {
      const { title, description } = updateDefaultValue;
      const tags = updateDefaultValue.tags.map((tag) => ({ name: tag }));
      reset({
        title,
        description,
        tags,
      });
    }
  }, [updateDefaultValue, reset]);

  const onFormSubmit = async (data: CreateNewIdea) => {
    const tags = data.tags.map(({ name }) => name);
    await handleCreateOrUpdateIdeaDoc({ ...data, tags }, createdSelect, isUpdate);
    return;
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack hasGutter>
        <StackItem>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: true, maxLength: 250 }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                fieldId="title"
                isRequired
                label="Give a title for your idea:"
                helperTextInvalid={error?.message}
                validated={error ? 'error' : 'default'}
              >
                <TextInput
                  id="title"
                  validated={error ? 'error' : 'default'}
                  aria-label="title"
                  isRequired
                  placeholder="What is your idea about?"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </StackItem>
        <StackItem>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: true, maxLength: 500 }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                fieldId="desc"
                isRequired
                label=" Brief description"
                helperTextInvalid={error?.message}
                validated={error ? 'error' : 'default'}
              >
                <TextArea
                  isRequired
                  validated={error ? 'error' : 'default'}
                  id="description"
                  aria-label="description"
                  placeholder="Describe you idea in simple terms…"
                  rows={10}
                  {...field}
                />
              </FormGroup>
            )}
          />
        </StackItem>
        <StackItem>
          <FormGroup fieldId="title" label=" Add some tags to your idea so others can find it:">
            <Select
              chipGroupProps={{
                numChips: 3,
                expandedText: 'Hide',
                collapsedText: 'Show ${remaining}',
              }}
              variant={SelectVariant.typeaheadMulti}
              typeAheadAriaLabel="Select a state"
              onToggle={onToggle}
              onSelect={(event, value) => handleSelect({ name: value as string }, 'name')}
              isCreatable
              onCreateOption={(newOptionValue) => onCreate({ name: newOptionValue }, 'name')}
              onClear={onClear}
              selections={selections}
              isOpen={selectIsOpen}
              loadingVariant={isLoading ? 'spinner' : undefined}
              aria-labelledby="tags for an idea"
              placeholderText="Select a tag"
            >
              {(tags || []).map((tag) => (
                <SelectOption value={tag} key={tag} />
              ))}
            </Select>
          </FormGroup>
        </StackItem>
        <StackItem className="pf-u-mt-md">
          <Split hasGutter style={{ alignItems: 'center' }}>
            <SplitItem isFilled />
            <SplitItem>
              <Button key="cancel" variant="plain" onClick={handleModalClose}>
                Cancel
              </Button>
            </SplitItem>
            <SplitItem>
              <Button key="submit" variant="primary" type="submit" isDisabled={isSubmitting}>
                {isUpdate ? 'Update my idea!' : 'Post my idea!'}
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      </Stack>
    </Form>
  );
};
