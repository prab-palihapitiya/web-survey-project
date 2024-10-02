import { TemplateObject } from "@/app/lib/config/template-config";
import { Container, Grid, GridCol } from "@mantine/core";

const TemplatePreview = ({ template }: { template: TemplateObject }) => {
    // console.log('template:', template);

    return (
        <Container h={'70vh'} style={{
            border: '1px solid var(--mantine-color-dark-0)',
        }}>
            <Grid>
                <GridCol>
                    <div>{template.primaryColor}</div>
                </GridCol>
            </Grid>
        </Container>
    );
}

export default TemplatePreview;