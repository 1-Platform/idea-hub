import {
    Button,
    FormGroup,
    Modal,
    Stack,
    StackItem,
    TextInput,
    Text,
    TextArea,
    ModalVariant,
    Split,
    SplitItem,
} from '@patternfly/react-core';

interface Props {
    isOpen: boolean;
    handleModalClose: () => void;
}

export const NewIdeaModal = ({ isOpen, handleModalClose }: Props): JSX.Element => {
    return (
        <Modal
            title="Post a new Idea!"
            isOpen={isOpen}
            variant={ModalVariant.small}
            onClose={handleModalClose}
        >
            <Stack hasGutter>
                <StackItem>
                    <FormGroup
                        fieldId="title"
                        label={
                            <Text style={{ color: '#2121218A' }} className="pb-2">
                                Give a title for your idea:
                            </Text>
                        }
                    >
                        <TextInput name="title" isRequired placeholder="What is your idea about?" />
                    </FormGroup>
                </StackItem>
                <StackItem>
                    <FormGroup
                        fieldId="desc"
                        label={
                            <Text style={{ color: '#2121218A' }} className="pb-2">
                                Brief description
                            </Text>
                        }
                    >
                        <TextArea
                            name="desc"
                            isRequired
                            placeholder="Describe you idea in simple terms…"
                            rows={10}
                        />
                    </FormGroup>
                </StackItem>
                <StackItem>
                    <FormGroup
                        fieldId="title"
                        label={
                            <Text style={{ color: '#2121218A' }} className="pb-2">
                                Add some tags to your idea so others can find it:
                            </Text>
                        }
                    >
                        <TextInput name="title" isRequired placeholder="Select at least one…" />
                    </FormGroup>
                </StackItem>
                <StackItem className="mt-4">
                    <Split hasGutter>
                        <SplitItem isFilled />
                        <SplitItem>
                            <Button key="cancel" variant="plain" onClick={handleModalClose}>
                                Cancel
                            </Button>
                        </SplitItem>
                        <SplitItem>
                            <Button key="submit" variant="primary" onClick={handleModalClose}>
                                Post my idea!
                            </Button>
                        </SplitItem>
                    </Split>
                </StackItem>
            </Stack>
        </Modal>
    );
};
