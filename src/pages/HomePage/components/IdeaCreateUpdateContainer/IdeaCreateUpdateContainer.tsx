import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  FormGroup,
  Stack,
  StackItem,
  TextInput,
  Text,
  TextArea,
  Split,
  SplitItem,
  Select,
  SelectOption,
  SelectVariant,
  Form,
} from '@patternfly/react-core';
import { Controller, useForm } from 'react-hook-form';

import { useFormSelect, useDebounce } from 'hooks';
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

export const IdeaCreateUpdateContainer = ({
  handleModalClose,
  handleCreateOrUpdateIdeaDoc,
  updateDefaultValue,
}: Props): JSX.Element => {
  const { tag } = usePouchDB();
  const [searchedTags, setSearchTags] = useState<string[]>([]);
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

  const handleSearchTag = useCallback(
    async (value: string | null) => {
      if (value) {
        const tags = await tag.getTagList(value);
        setSearchTags(tags.docs.map((el) => el._id));
      } else {
        setSearchTags([]);
      }
    },
    [tag]
  );

  const { setUnDebouncedState, isDebouncing } = useDebounce<string | null>(null, handleSearchTag);

  const onFormSubmit = async (data: CreateNewIdea) => {
    const tags = data.tags.map(({ name }) => name);
    await handleCreateOrUpdateIdeaDoc({ ...data, tags }, createdSelect, isUpdate);

    return;
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack hasGutter>
        <StackItem>
          <FormGroup
            fieldId="title"
            label={
              <Text style={{ color: '#2121218A' }} className="pf-u-pb-sm">
                Give a title for your idea:
              </Text>
            }
          >
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextInput
                  id="title"
                  aria-label="title"
                  isRequired
                  placeholder="What is your idea about?"
                  {...field}
                />
              )}
            />
          </FormGroup>
        </StackItem>
        <StackItem>
          <FormGroup
            fieldId="desc"
            label={
              <Text style={{ color: '#2121218A' }} className="pf-u-pb-sm">
                Brief description
              </Text>
            }
          >
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextArea
                  isRequired
                  id="description"
                  aria-label="description"
                  placeholder="Describe you idea in simple terms…"
                  rows={10}
                  {...field}
                />
              )}
            />
          </FormGroup>
        </StackItem>
        <StackItem>
          <FormGroup
            fieldId="title"
            label={
              <Text style={{ color: '#2121218A' }} className="pf-u-pb-sm">
                Add some tags to your idea so others can find it:
              </Text>
            }
          >
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
              onTypeaheadInputChanged={(value) => {
                setUnDebouncedState(value);
              }}
              selections={selections}
              isOpen={selectIsOpen}
              loadingVariant={isDebouncing ? 'spinner' : undefined}
              aria-labelledby="tags for an idea"
              placeholderText="Select a tag"
            >
              {searchedTags.map((tag) => (
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
