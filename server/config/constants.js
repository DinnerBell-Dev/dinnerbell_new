module.exports = {
    'pusher': {
        'appId': '487456',
        'key': '760d4bd616622b123992',
        'secret': 'c50acab890efb39b399a',
        'cluster': 'us2'
    },
    'mailgun': {
        'api_key': 'key-0e4228878343f000e39d52fff01ff844',
        'DOMAIN': 'mail.dinnerbell.co',
        'from': 'DinnerBell <postmaster@mail.dinnerbell.co>'
    },
    'site_url': 'http://52.23.184.189/app/',
    'user_home': 'http://52.23.184.189/app/home',
    'admin_email': 'mail@petermaslov.com',
    'admin_dashboard': 'http://52.23.184.189/app/admin/dashboard',
    'twilio': {
        'accountSid': 'AC14d0d32ed6c82130acc0140118f445af',
        'authToken': '1c16b2c6684735a6e57935f8c93115f4',
        'twilioNumber': '+13472066278',
        'authyKey': 'gqCDyQhbxrdOKVus0G120RSkOprWUMsy',
    },
    'errors': {
        'invalid_params': {
            'status': 'invalid_params',
            'message': 'Invalid parameter posted'
        },

        'server_error': {
            'status': 'server_error',
            'message': 'There are errors in server'
        },
        'not_found': {
            'status': 'not_found',
            'message': 'Not Found'
        },
        'user': {
            'duplicated_email': {
                'status': 'duplicated_email',
                'message': 'Email already exists'
            },
            'duplicated_account': {
                'status': 'duplicated_account',
                'message': 'Duplicated account exist'
            },
            'email_not_found': {
                'status': 'email not found',
                'message': "Email ID is not registered."
            },
            'user_not_found': {
                'status': 'user_not_found',
                'message': 'Not found user'
            },
            'auth_fail': {
                'status': 'not_found',
                'message': 'Incorrect password, please try again.'
            },
            'incorrect_old_password': {
                'status': 'not_found',
                'message': 'Old password not matches!'
            },
            'authorization_error': {
                'status': 'not_authorized',
                'message': 'You have not right to access'
            },
            'pending': {
                'status': 'pending',
                'message': 'Your account is not approved yet.'
            },
            'rejected': {
                'status': 'rejected',
                'message': 'Your account is rejected.'
            },
            'verify_failed': {
                'status': 'incorrect_verification',
                'message': 'Verification Info is incorrect'
            }
        }
    },
    'subscription_parameters': {
        'expiration_period': 14, // number of days to expire
        'first_notification': 2, // number of days to send first notification
        'second_notification': 10, // number of days to send second notification
    },
    'default_user_data': {
        'menus': [{
            'menu_name': 'Breakfast',
            'start_hour': 5,
            'to_hour': 8,
            'menu_type': 'Regular menu',
            'menu_photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347267655.jpg',
            'menu_item': {
                'name': 'Breakfast item',
                'description': 'Breakfast item description',
                'photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347336375.jpg'
            }
        }, {
            'menu_name': 'Lunch',
            'start_hour': 11,
            'to_hour': 14,
            'menu_type': 'Regular menu',
            'menu_photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347388576.jpg',
            'menu_item': {
                'name': 'Lunch item',
                'description': 'Lunch item description',
                'photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347427189.jpg'
            }
        }, {
            'menu_name': 'Dinner',
            'start_hour': 20,
            'to_hour': 23,
            'menu_type': 'Regular menu',
            'menu_photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347466625.jpg',
            'menu_item': {
                'name': 'Dinner item',
                'description': 'Dinner item description',
                'photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347583378.jpg'
            }
        }, {
            'menu_name': 'Prix-fixe',
            'start_hour': 5,
            'to_hour': 8,
            'menu_type': 'Prix-fixe menu',
            'menu_photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347623995.jpg',
            'menu_item': {
                'name': 'Prix-fixe item',
                'description': 'Prix-fixe item description',
                'photo': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347653161.jpg'
            }
        }],
        'categories': [{
                'category_name': 'Greens',
                'category_photo_name': '1551347267655.jpg',
                'category_photo_url': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347267655.jpg',
                'category_items': [{
                    'name': 'Greens 1',
                    'description': 'Greens 1 description1',
                    'photo_name': '1551347388576.jpg',
                    'photo_url': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347388576.jpg'
                }, {
                    'name': 'Greens 2',
                    'description': 'Greens 2 description',
                    'photo_name': '1551347466625.jpg',
                    'photo_url': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347466625.jpg'
                }]
            },
            {
                'category_name': 'Sides',
                'category_photo_name': '1551347466625.jpg',
                'category_photo_url': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347466625.jpg',
                'category_items': [{
                    'name': 'Sides 1',
                    'description': 'Sides 1 description',
                    'photo_name': '1551347388576.jpg',
                    'photo_url': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347388576.jpg'
                }, {
                    'name': 'Sides 2',
                    'description': 'Sides 2 description',
                    'photo_name': '1551347466625.jpg',
                    'photo_url': 'http://52.23.184.189/app/api/images/uploadedfiles/1551347466625.jpg'
                }]
            }
        ],
    },
    'jwt': {
        'JWT_ENCRYPTION': 'secretKey',
        'JWT_EXPIRATION': '7d',
    },
};