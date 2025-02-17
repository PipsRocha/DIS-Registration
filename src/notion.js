// Environment variables
const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;

/**
 * Create a registrant with Notion.
 * @param {Object} registrantDetails - The registrant data to send to Notion.
 * @returns {Promise<Object>} - The API response from Notion.
 */
const createRegistrant = async (registrantDetails) => {
    try {
        
        const response = await fetch(`https://api.notion.com/v1/pages`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
              },
              body: JSON.stringify({
                'parent': {
                    'type': 'database_id',
                    'database_id': NOTION_DATABASE_ID },
               "properties": {
                    "email": {
                        "title": [
                            {
                                "text": {
                                    "content": registrantDetails.email
                                }
                            }
                        ]
                    },
                    "Name": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.name
                                }
                            }
                        ]
                    },
                    "ACM Number": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.acmnumber
                                }
                            }
                        ]
                    },
                    "Registration Type": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.registrationType
                                }
                            }
                        ]
                    },
                    "Pronouns": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.pronouns
                                }
                            }
                        ]
                    },
                    "Company": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.company
                                }
                            }
                        ]
                    },  
                    "Badge Name": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails["fname-badge"]
                                }
                            }
                        ]
                    },
                    "Badge Last Name": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails["lname-badge"]
                                }
                            }
                        ]
                    },
                    "Job Title": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.jobtitle
                                }
                            }
                        ]
                    },
                    "Needs ACM": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.sneedsacm
                                }
                            }
                        ]
                    },
                    "Needs Conference": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.sneedsconference
                                }
                            }
                        ]
                    },
                    "Billing Name": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.billingname
                                }
                            }
                        ]
                    },
                    "Address": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.billingaddress
                                }
                            }
                        ]
                    },
                    "City": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.billingcity
                                }
                            }
                        ]
                    },
                    "Country": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.billingcountry
                                }
                            }
                        ]
                    },
                    "State": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.state
                                }
                            }
                        ]
                    },
                    "Postal Code": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.postalcode
                                }
                            }
                        ]
                    },
                    "Phone": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.phone
                                }
                            }
                        ]
                    },
                    "VAT": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.vat
                                }
                            }
                        ]
                    },
                    "Speaker": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.speaker
                                }
                            }
                        ]
                    },
                    "postal-mail-consent": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails["postal-mail-consent"]
                                }
                            }
                        ]
                    },
                    "email-consent": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails["email-consent"]
                                }
                            }
                        ]
                    },
                    "email-opt-in": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails["email-opt-in"]
                                }
                            }
                        ]
                    },
                    "Payment Type": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.type
                                }
                            }
                        ]
                    },

                    "Amount": {
                        "number": registrantDetails.amount
                    },

                    "Cart Items": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": registrantDetails.cartItems
                                }
                            }
                        ]
                    },
                }
            }),
        });

        console.log(JSON.stringify({
            'parent': {
                'type': 'database_id',
                'database_id': NOTION_DATABASE_ID },
            'properties': registrantDetails
        }))
        
        if (!response.ok) {
            const errorData = await response.json(); // Extract error response data
            console.log(response)
            throw new Error(errorData.error || response.statusText);
        }

        const data = await response.json(); // Extract success response data
        return data;
    } catch (error) {
        console.error("Notion API Error:", error.message);
        throw new Error(error.message || "Failed to create registrant");
    }
};

module.exports = {
    createRegistrant,
};