import { useEffect, useState } from 'react';
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

import { useFormSelect } from 'hooks';
import { usePouchDB } from 'context';
import { CreateNewIdea } from 'pages/HomePage/types';
import { CreateIdeaDoc, IdeaDoc } from 'pouchDB/types';

interface Props {
  handleModalClose: () => void;
  handleCreateOrUpdateIdeaDoc: (
    data: CreateIdeaDoc,
    createdTags: string[],
    isUpdate: boolean
  ) => Promise<void>;
  updateDefaultValue?: IdeaDoc;
}

type SearchTag = { isLoading: boolean; data: string[] };

export const IdeaCreateUpdateContainer = ({
  handleModalClose,
  handleCreateOrUpdateIdeaDoc,
  updateDefaultValue,
}: Props): JSX.Element => {
  const { tag } = usePouchDB();
  const [tagList, setTagList] = useState<SearchTag>({ isLoading: true, data: [] });
  // form handling hooks
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateNewIdea>();

  const isUpdate = Boolean(updateDefaultValue?._rev);

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

  useEffect(() => {
    handleFetchTagList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchTagList = async () => {
    try {
      const tags = await tag.getTagList(1000);
      setTagList({ isLoading: false, data: tags.docs.map((el) => el._id) });
    } catch (error) {
      setTagList({ isLoading: false, data: [] });
      window.OpNotification.danger({ subject: 'Fetching tag failed' });
    }
  };

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
            rules={{ required: true }}
            render={({ field }) => (
              <FormGroup fieldId="title" isRequired label="Give a title for your idea:">
                <TextInput
                  id="title"
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
            rules={{ required: true }}
            render={({ field }) => (
              <FormGroup fieldId="desc" isRequired label=" Brief description">
                <TextArea
                  isRequired
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
              loadingVariant={tagList.isLoading ? 'spinner' : undefined}
              aria-labelledby="tags for an idea"
              placeholderText="Select a tag"
            >
              {tagList.data.map((tag) => (
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
              <Button key="submit" variant="primary" type="submit" isLoading={isSubmitting}>
                {isUpdate ? 'Update my idea!' : 'Post my idea!'}
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      </Stack>
    </Form>
  );
};
