const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');

const Department = require("../../../models/department");
const Supplier = require("../../../models/supplier");

exports.getAnswerFromBot = async (projectId, text) => {

    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();

    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    return result.fulfillmentMessages

}

exports.getResponseToBot = async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    let payload;

    if (agent.intent === 'supplier_information' || agent.intent === 'supplier_name') {
        await supplierInformation()
    } else if (agent.intent === 'no_name_supplier') {
        await supplierList()
    } else if (agent.intent === 'top_supplier_based_on_revenue') {
        await topSupplierRevenue()
    } else if (agent.intent === 'top_supplier_based_on_expenditure') {
        await topSupplierExpenditure()
    }

    async function supplierList() {

        const data = await Supplier.find({})

        var supplierNameList = data.map(function (el) { return el.name; });

        payload = [
            {
                "text": {
                    "text": [
                        "Please select the suppliers"
                    ]
                }
            },
            {
                "payload": {
                    "data": supplierNameList,
                    "type": "dropdown"
                }
            }
        ]
    }

    async function supplierInformation() {
        const name = req.body.queryResult.parameters['supplier']

        const data = await Supplier.find({ 'name': name })

        if (data.length === 0) {
            payload = [
                {
                    "text": {
                        "text": [
                            `Supplier doesnot exists`
                        ]
                    }
                }
            ]
        } else {
            payload = [
                {
                    "text": {
                        "text": [
                            `Below is the information for your query on ${name}`
                        ]
                    }
                },
                {
                    "payload": {
                        "data": data,
                        "type": "table"
                    }
                }
            ]

        }
    }

    async function topSupplierRevenue() {
        const departmentName = req.body.queryResult.parameters['department-names']
        const number = req.body.queryResult.parameters['number']

        if (!!departmentName) {
            const data = await Department.aggregate(
                [
                    {
                        "$match": {
                            "name": departmentName
                        }
                    },
                    {
                        "$lookup": {
                            "from": "supplier",
                            let: {
                                eid: "$supplier_id"
                            },
                            pipeline: [
                                {
                                    "$match": {
                                        $expr: {
                                            $in: [
                                                "$_id",
                                                "$$eid"
                                            ]
                                        }
                                    }
                                },
                                {
                                    $sort: {
                                        revenue: -1
                                    }
                                },
                                {
                                    "$limit": number
                                }
                            ],
                            "as": "suppliers"
                        }
                    },
                    {
                        "$unwind": {
                            path: "$suppliers"
                        }
                    },
                    {
                        "$replaceRoot": {
                            "newRoot": "$suppliers"
                        }
                    }
                ]
            )

            payload = [
                {
                    "text": {
                        "text": [
                            `Top ${number} suppliers for ${departmentName} with highest revenue`
                        ]
                    }
                },
                {
                    "payload": {
                        "data": data,
                        "type": "table"
                    }
                }
            ]
        } else {
            const data = await Supplier.aggregate([
                { $sort: { revenue: -1 } },
                { $limit: number }
            ])

            payload = [
                {
                    "text": {
                        "text": [
                            `Top ${number} suppliers with highest revenue`
                        ]
                    }
                },
                {
                    "payload": {
                        "data": data,
                        "type": "table"
                    }
                }
            ]

        }
    }

    async function topSupplierExpenditure() {
        const departmentName = req.body.queryResult.parameters['department-names']
        const number = req.body.queryResult.parameters['number']

        if (!!departmentName) {
            const data = await Department.aggregate(
                [
                    {
                        "$match": {
                            "name": departmentName
                        }
                    },
                    {
                        "$lookup": {
                            "from": "supplier",
                            let: {
                                eid: "$supplier_id"
                            },
                            pipeline: [
                                {
                                    "$match": {
                                        $expr: {
                                            $in: [
                                                "$_id",
                                                "$$eid"
                                            ]
                                        }
                                    }
                                },
                                {
                                    $sort: {
                                        spending: -1
                                    }
                                },
                                {
                                    "$limit": number
                                }
                            ],
                            "as": "suppliers"
                        }
                    },
                    {
                        "$unwind": {
                            path: "$suppliers"
                        }
                    },
                    {
                        "$replaceRoot": {
                            "newRoot": "$suppliers"
                        }
                    }
                ]
            )

            payload = [
                {
                    "text": {
                        "text": [
                            `Top ${number} suppliers for ${departmentName} with highest expenditure`
                        ]
                    }
                },
                {
                    "payload": {
                        "data": data,
                        "type": "table"
                    }
                }
            ]
        } else {
            const data = await Supplier.aggregate([
                { $sort: { spending: -1 } },
                { $limit: number }
            ])

            payload = [
                {
                    "text": {
                        "text": [
                            `Top ${number} suppliers with highest expenditure`
                        ]
                    }
                },
                {
                    "payload": {
                        "data": data,
                        "type": "table"
                    }
                }
            ]
        }
    }
    return (JSON.stringify({ "fulfillmentMessages": payload }))
}
