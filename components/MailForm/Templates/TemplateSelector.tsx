import React from 'react';

import { Pane, Heading, Text, majorScale } from 'evergreen-ui';

import {
    EMAIL_TEMPLATE_ENTRIES,
    EmailTemplate,
    TemplateType,
} from './emailTemplates';

interface TemplateSelectorProps {
    selectedTemplate: TemplateType;
    onSelectTemplate: (type: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    selectedTemplate,
    onSelectTemplate,
}) => {
    return (
        <Pane
            background='#FAFAFA'
            borderRadius={5}
            borderColor='#DADADA'
            padding={majorScale(2)}
            marginBottom={majorScale(2)}
            border='default'
        >
            {/* Header */}
            <Pane
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                marginBottom={majorScale(2)}
            >
                <Heading size={400}>✨ Start with a template</Heading>
            </Pane>

            {/* Template Grid */}
            <Pane
                display='grid'
                gridTemplateColumns='repeat(auto-fill, minmax(100px, 1fr))'
                gap={majorScale(2)}
            >
                {EMAIL_TEMPLATE_ENTRIES.map(([type, template]) => (
                    <TemplateCard
                        key={type}
                        template={template}
                        type={type}
                        isSelected={selectedTemplate === type}
                        onSelect={() => onSelectTemplate(type)}
                    />
                ))}
            </Pane>
        </Pane>
    );
};

interface TemplateCardProps {
    template: EmailTemplate;
    type: TemplateType;
    isSelected: boolean;
    onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    type,
    isSelected,
    onSelect,
}) => {
    return (
        <Pane onClick={onSelect} className='template-card'>
            {/* Preview Box */}
            <Pane
                background='white'
                border={isSelected ? '2px solid #FFCB97' : '2px solid #E4E7EB'}
                borderRadius={8}
                height={80}
                display='flex'
                alignItems='center'
                justifyContent='center'
                marginBottom={majorScale(1)}
                boxShadow={
                    isSelected ? '0 0 0 3px rgba(255, 105, 0, 0.1)' : undefined
                }
                transition='all 0.2s'
                position='relative'
                overflow='hidden'
                className='template-preview-box'
            >
                {type === 'blank' ? (
                    <Text fontSize={24}>{template.icon}</Text>
                ) : (
                    <TemplateMiniPreview type={type} icon={template.icon} />
                )}
            </Pane>

            {/* Template Name */}
            <Text
                size={300}
                fontWeight={isSelected ? 600 : 500}
                color={isSelected ? '#E77500' : 'default'}
            >
                {template.name}
            </Text>
        </Pane>
    );
};

interface TemplateMiniPreviewProps {
    type: TemplateType;
    icon: string;
}

const TemplateMiniPreview: React.FC<TemplateMiniPreviewProps> = ({
    type,
    icon,
}) => {
    const renderPreview = () => {
        switch (type) {
            case 'event':
                return (
                    <Pane padding={10} width='100%'>
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                        />
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                            width='60%'
                            marginTop={4}
                        />
                        <Pane
                            height={20}
                            background='#E8F4FD'
                            borderRadius={4}
                            marginTop={6}
                        />
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                            marginTop={4}
                        />
                    </Pane>
                );
            case 'application':
                return (
                    <Pane padding={10} width='100%'>
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                            width='60%'
                        />
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                            marginTop={4}
                        />
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                            marginTop={4}
                        />
                    </Pane>
                );
            case 'survey':
                return (
                    <Pane padding={10} width='100%'>
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                        />
                        <Pane
                            height={14}
                            background='#FFF3CD'
                            borderRadius={4}
                            marginTop={6}
                        />
                        <Pane
                            height={4}
                            background='#E4E7EB'
                            borderRadius={2}
                            width='60%'
                            marginTop={4}
                        />
                    </Pane>
                );
            default:
                return <Text fontSize={20}>{icon}</Text>;
        }
    };

    return renderPreview();
};
