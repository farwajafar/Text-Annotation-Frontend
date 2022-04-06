/* eslint-disable max-len */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { Annotator } from "image-labeler-react";
import { API_BASE_URL } from "src/config";
import {
    Card,
    FormHelperText,
    CardActionArea,
    CardActions,
    Box,
    Divider,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    makeStyles,
    Button,
    Container,
    Badge,
} from "@material-ui/core";
import { user_detection_post } from "src/actions/detectionActions";
import { withStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { detection_post } from "src/actions/detectionActions";

const tabs = [
    {
        value: 1,
        label: "Pending",
    },
    {
        value: 2,
        label: "Annotated",
    },
    {
        value: 3,
        label: "Rejected",
    },
];

function applyFilters(customers, filters) {
    return customers.filter((customer) => {
        let matches = true;

        Object.keys(filters).forEach((key) => {
            const value = filters[key];

            if (value && customer.status !== value) {
                matches = false;
            }
        });

        return matches;
    });
}

function applyPagination(customers, page, limit) {
    return customers.slice(page * limit, page * limit + limit);
}

 function applyBoxInfo(box_info) {
    const boxData = box_info.split("\n");
    let boxObjArray = [];

    boxData.forEach((data) => {
        const singleBoxData = data.split(",");
        const x1 = parseInt(singleBoxData[0]);
        const y1 = parseInt(singleBoxData[1]);
        const x2 = parseInt(singleBoxData[2]);
        const y2 = parseInt(singleBoxData[3]);
        const x3 = parseInt(singleBoxData[4]);
        const y3 = parseInt(singleBoxData[5]);
        const x4 = parseInt(singleBoxData[6]);
        const y4 = parseInt(singleBoxData[7]);
        const minValueX = Math.min(x1, x2, x3, x4);
        const maxValueX = Math.max(x1, x2, x3, x4);
        const minValueY = Math.min(y1, y2, y3, y4);
        const maxValueY = Math.max(y1, y2, y3, y4);
        const width = maxValueX - minValueX;
        const height = maxValueY - minValueY;
        const boxObj = {
            x: minValueX,
            y: minValueY,
            w: width,
            h: height,
            annotation: "",
        };
        boxObjArray.push(boxObj);
    });
    return boxObjArray;
}

function boxDataAdjust(box_info) {
    let newBoxObjArray = "";
    box_info.forEach((data) => {
        const height = parseInt(data.h);
        const width = parseInt(data.w);
        const x = parseInt(data.x); //MINIMUM VALUE X
        const y = parseInt(data.y); //MINIMUM VALUE Y
        const x1 = parseInt(x);
        const y1 = parseInt(y);
        const x2 = parseInt(width + x); // width + minimum X
        const y2 = parseInt(y);
        const x3 = parseInt(width + x); // width + minimum X
        const y3 = parseInt(height + y); // height + minimum X
        const x4 = parseInt(x);
        const y4 = parseInt(height + y);
        const result = x1 + "," +y1 +"," +x2 +"," + y2 +"," +x3 +"," +y3 +"," + x4 +"," +y4 +"\n";
        newBoxObjArray = newBoxObjArray + result;
    });
    return newBoxObjArray;
}

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    media: {
        height: 450,
    },
    button: {
        margin: theme.spacing(1),
    },
}));

const StyledBadge = withStyles((theme) => ({
    badge: {
        right: -22,
        top: 0,
        border: `0.5px solid ${theme.palette.background.paper}`,
        padding: "0 4px",
        fontSize: 16,
    },
}))(Badge);

function Results({ className, customers, onSubmitSuccess, ...rest }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(1);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(1);
    const [filters, setFilters] = useState({
        1: 1,
        2: null,
        3: null,
    });

    const handleTabsChange = (event, value) => {
        const updatedFilters = {
            ...filters,
            1: null,
            2: null,
            3: null,
        };

        if (value !== "all") {
            updatedFilters[value] = value;
        }
        setFilters(updatedFilters);
        setCurrentTab(value);
        setPage(0);
    };

    const handleSkipButtonClick = (page) => {
        //console.log("hello", page);
        setPage(page);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    // Usually query is done on backend with indexing solutions
    const filteredCustomers = applyFilters(customers, filters);
    const paginatedCustomers = applyPagination(filteredCustomers, page, limit);

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <Tabs
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="secondary"
                value={currentTab}
                variant="scrollable"
            >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        label={
                            <div className={classes.root}>
                                <StyledBadge
                                    badgeContent={
                                        tab.value == currentTab
                                            ? filteredCustomers.length
                                            : null
                                    }
                                    color="primary"
                                    max={9999}
                                >
                                    {tab.label}
                                </StyledBadge>
                            </div>
                        }
                    />
                ))}
            </Tabs>
            <Divider />
            <PerfectScrollbar>
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            {/* <TableRow>
                                <TableCell>Detection Frame</TableCell>
                            </TableRow> */}
                        </TableHead>
                        <TableBody>
                            {paginatedCustomers.map((customer) => {
                                return (
                                    <TableRow hover key={customer.frame_id}>
                                        <TableCell>
                                            <Formik
                                                initialValues={{
                                                    frame_id: customer.frame_id,
                                                    box: customer.box,
                                                    channel:
                                                        customer.channel_name,
                                                    avatar: `${API_BASE_URL}${customer.image}`,
                                                    status: customer.status,
                                                    comments:
                                                        customer.comments ||
                                                        "Comments",
                                                }}
                                            >
                                                {({
                                                    errors,
                                                    handleSubmit,
                                                    isSubmitting,
                                                    values,
                                                }) => (
                                                    <form
                                                        noValidate
                                                        onSubmit={handleSubmit}
                                                        {...rest}
                                                    >
                                                        <Container>
                                                            <Box mt={2}>
                                                                {errors.submit && (
                                                                    <Box mt={3}>
                                                                        <FormHelperText
                                                                            error
                                                                        >
                                                                            {
                                                                                errors.submit
                                                                            }
                                                                        </FormHelperText>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                            {currentTab == 3 ? (
                                                                <Box
                                                                    mt={2}
                                                                    mb={1}
                                                                >
                                                                    <Alert
                                                                        variant="outlined"
                                                                        severity="error"
                                                                    >
                                                                        {
                                                                            values.comments
                                                                        }
                                                                    </Alert>
                                                                </Box>
                                                            ) : null}
                                                            <Card fullWidth>
                        <CardActionArea>
                     <Annotator
                        height={555 }
                         width={985}
                         imageUrl={values.avatar }
                         asyncUpload={async (labeledData ) => {
                            const boxData = boxDataAdjust(labeledData.boxes  );
                            const status = 2;
                                 try {
                                 await dispatch(
                                     detection_post(
                                       values.frame_id,
                                       status,
                                       boxData
                                       ));
                        onSubmitSuccess();
                        enqueueSnackbar(
                              "Updated Successfully",
                            {
                            variant:"success",
                             });
                             } catch (error) {} }}

                        types={["Square","Rectangle","Cylinder",]}

                        defaultType={""}
                        
                        defaultBoxes={
                            applyBoxInfo(customer.box)
                        }
                        disableAnnotation={false}
                      />

                        </CardActionArea>
                        <CardActions
                         disableSpacing
                         style={{
                                 display:"flex",
                                 justifyContent:"flex-end",
                                }}
                                >
                                                                            
                                                                       
                                                                            
                                                                
                                                                    <Button
                                                                        style={{
                                                                            marginLeft:
                                                                                "auto",
                                                                        }}
                                                                        onClick={async () => {
                                                                            handleSkipButtonClick(
                                                                                page +
                                                                                    1
                                                                            );
                                                                            try {
                                                                                await dispatch(
                                                                                    user_detection_post(
                                                                                        values.frame_id,
                                                                                        5
                                                                                    )
                                                                                );
                                                                                enqueueSnackbar(
                                                                                    "Skipped Successfully",
                                                                                    {
                                                                                        variant:
                                                                                            "success",
                                                                                    }
                                                                                );
                                                                                onSubmitSuccess();
                                                                            } catch (error) {
                                                                                console.log(
                                                                                    error
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        Skip
                                                                    </Button>
                                                                </CardActions>

                                                            </Card>
                                                        </Container>
                                                    </form>
                                                )}
                                            </Formik>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                count={filteredCustomers.length}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[1]}
            />
        </Card>
    );
}

Results.propTypes = {
    className: PropTypes.string,
    customers: PropTypes.array,
};

Results.defaultProps = {
    customers: [],
};

export default Results;
