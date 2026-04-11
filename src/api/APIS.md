---
title: Ventally API v1.0.0
language_tabs:
  - shell: cURL
  - javascript: Node.js
language_clients:
  - shell: ""
  - javascript: ""
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ventally-api">Ventally API v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Emotional support calling platform with per-minute billing

Base URLs:

* <a href="{protocol}://{host}:{port}">{protocol}://{host}:{port}</a>

    * **protocol** - Protocol to use Default: https

        * http

        * https

    * **host** - API server host Default: api.dev.ventally.co

    * **port** - Server port Default: 443

        * 80

        * 443

        * 3000

        * 8080

* <a href="http://localhost:3001">http://localhost:3001</a>

Email: <a href="mailto:support@ventally.com">Ventally Support</a> 
License: <a href="https://opensource.org/licenses/ISC">ISC</a>

# Authentication

- HTTP Authentication, scheme: bearer Enter your JWT token from the login/register response

<h1 id="ventally-api-authentication">Authentication</h1>

User authentication and account management endpoints

## Register a new user account

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "userType": "venter",
  "phone": "+1234567890"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/register`

Create a new venter or listener account with email, password, and phone number. Admin accounts cannot be created via signup.

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "userType": "venter",
  "phone": "+1234567890"
}
```

<h3 id="register-a-new-user-account-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|none|
|» password|body|string(password)|true|Must contain uppercase, lowercase, number, and special character|
|» userType|body|string|true|none|
|» phone|body|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» userType|venter|
|» userType|listener|

> Example responses

> 201 Response

```json
{
  "message": "string",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "userType": "venter",
    "activeRole": "venter",
    "availableRoles": [
      "venter",
      "listener"
    ],
    "phone": "string",
    "displayName": "string",
    "preferredLanguage": "en",
    "listenerSignature": "string",
    "verificationDocumentStatus": "not_submitted",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2019-08-24T14:15:22Z"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string",
    "verificationToken": "string"
  }
}
```

<h3 id="register-a-new-user-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User registered successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input or user already exists|[Error](#schemaerror)|

<h3 id="register-a-new-user-account-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|[User](#schemauser)|false|none|none|
|»» id|string(uuid)|false|none|User unique identifier|
|»» email|string(email)|false|none|User email address|
|»» userType|string|false|none|User role type (equals activeRole, kept for backward compatibility)|
|»» activeRole|string|false|none|Currently active role|
|»» availableRoles|[string]|false|none|All roles user can switch between|
|»» phone|string|false|none|User phone number|
|»» displayName|string¦null|false|none|Public display name of the user|
|»» preferredLanguage|string¦null|false|none|Preferred language code (for example: en, pt, es)|
|»» listenerSignature|string¦null|false|none|Listener signature URL or base64 value|
|»» verificationDocumentStatus|string¦null|false|none|Current listener verification document status|
|»» isVerified|boolean|false|none|Email verification status|
|»» isActive|boolean|false|none|Account active status|
|»» createdAt|string(date-time)|false|none|Account creation timestamp|
|» tokens|any|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[Tokens](#schematokens)|false|none|none|
|»»» accessToken|string|false|none|JWT access token (expires in 7 days)|
|»»» refreshToken|string|false|none|JWT refresh token (expires in 30 days)|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» verificationToken|string|false|none|Email verification token|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|venter|
|userType|listener|
|userType|admin|
|userType|sub_admin|
|activeRole|venter|
|activeRole|listener|
|activeRole|admin|
|activeRole|sub_admin|
|verificationDocumentStatus|not_submitted|
|verificationDocumentStatus|pending|
|verificationDocumentStatus|approved|
|verificationDocumentStatus|rejected|

<aside class="success">
This operation does not require authentication
</aside>

## Login to existing account

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "password": "SecurePass123!"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/login`

Authenticate user with email and password, returns JWT tokens

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

<h3 id="login-to-existing-account-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|none|
|» password|body|string(password)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "userType": "venter",
    "activeRole": "venter",
    "availableRoles": [
      "venter",
      "listener"
    ],
    "phone": "string",
    "displayName": "string",
    "preferredLanguage": "en",
    "listenerSignature": "string",
    "verificationDocumentStatus": "not_submitted",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2019-08-24T14:15:22Z"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

<h3 id="login-to-existing-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Login successful|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid credentials|[Error](#schemaerror)|

<h3 id="login-to-existing-account-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|[User](#schemauser)|false|none|none|
|»» id|string(uuid)|false|none|User unique identifier|
|»» email|string(email)|false|none|User email address|
|»» userType|string|false|none|User role type (equals activeRole, kept for backward compatibility)|
|»» activeRole|string|false|none|Currently active role|
|»» availableRoles|[string]|false|none|All roles user can switch between|
|»» phone|string|false|none|User phone number|
|»» displayName|string¦null|false|none|Public display name of the user|
|»» preferredLanguage|string¦null|false|none|Preferred language code (for example: en, pt, es)|
|»» listenerSignature|string¦null|false|none|Listener signature URL or base64 value|
|»» verificationDocumentStatus|string¦null|false|none|Current listener verification document status|
|»» isVerified|boolean|false|none|Email verification status|
|»» isActive|boolean|false|none|Account active status|
|»» createdAt|string(date-time)|false|none|Account creation timestamp|
|» tokens|[Tokens](#schematokens)|false|none|none|
|»» accessToken|string|false|none|JWT access token (expires in 7 days)|
|»» refreshToken|string|false|none|JWT refresh token (expires in 30 days)|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|venter|
|userType|listener|
|userType|admin|
|userType|sub_admin|
|activeRole|venter|
|activeRole|listener|
|activeRole|admin|
|activeRole|sub_admin|
|verificationDocumentStatus|not_submitted|
|verificationDocumentStatus|pending|
|verificationDocumentStatus|approved|
|verificationDocumentStatus|rejected|

<aside class="success">
This operation does not require authentication
</aside>

## Login or register with Google OAuth

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/google-login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ...",
  "userType": "venter"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/google-login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/google-login`

Authenticate user using Google ID token. Creates new account if user doesn't exist, or logs in existing user. Google accounts are automatically verified.

> Body parameter

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ...",
  "userType": "venter"
}
```

<h3 id="login-or-register-with-google-oauth-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» idToken|body|string|true|Google ID token obtained from Google Sign-In|
|» userType|body|string|true|User type (only required for new registrations)|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» userType|venter|
|» userType|listener|

> Example responses

> 200 Response

```json
{
  "message": "Login successful via Google",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "userType": "venter",
    "activeRole": "venter",
    "availableRoles": [
      "venter",
      "listener"
    ],
    "phone": "string",
    "displayName": "string",
    "preferredLanguage": "en",
    "listenerSignature": "string",
    "verificationDocumentStatus": "not_submitted",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2019-08-24T14:15:22Z"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

> Invalid request or unverified Google email

```json
{
  "error": "Missing token",
  "message": "Google ID token is required"
}
```

```json
{
  "error": "Invalid user type",
  "message": "User type must be either \"venter\" or \"listener\""
}
```

```json
{
  "error": "Email not verified",
  "message": "Please use a verified Google account"
}
```

> 401 Response

```json
{
  "error": "Invalid token",
  "message": "Failed to verify Google ID token"
}
```

> 503 Response

```json
{
  "error": "Service unavailable",
  "message": "Google login is not configured on this server"
}
```

<h3 id="login-or-register-with-google-oauth-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Google authentication successful|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request or unverified Google email|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Google ID token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Account disabled|[Error](#schemaerror)|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Google OAuth not configured|[Error](#schemaerror)|

<h3 id="login-or-register-with-google-oauth-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|any|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[User](#schemauser)|false|none|none|
|»»» id|string(uuid)|false|none|User unique identifier|
|»»» email|string(email)|false|none|User email address|
|»»» userType|string|false|none|User role type (equals activeRole, kept for backward compatibility)|
|»»» activeRole|string|false|none|Currently active role|
|»»» availableRoles|[string]|false|none|All roles user can switch between|
|»»» phone|string|false|none|User phone number|
|»»» displayName|string¦null|false|none|Public display name of the user|
|»»» preferredLanguage|string¦null|false|none|Preferred language code (for example: en, pt, es)|
|»»» listenerSignature|string¦null|false|none|Listener signature URL or base64 value|
|»»» verificationDocumentStatus|string¦null|false|none|Current listener verification document status|
|»»» isVerified|boolean|false|none|Email verification status|
|»»» isActive|boolean|false|none|Account active status|
|»»» createdAt|string(date-time)|false|none|Account creation timestamp|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» isVerified|boolean|false|none|Always true for Google OAuth users|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» tokens|[Tokens](#schematokens)|false|none|none|
|»» accessToken|string|false|none|JWT access token (expires in 7 days)|
|»» refreshToken|string|false|none|JWT refresh token (expires in 30 days)|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|venter|
|userType|listener|
|userType|admin|
|userType|sub_admin|
|activeRole|venter|
|activeRole|listener|
|activeRole|admin|
|activeRole|sub_admin|
|verificationDocumentStatus|not_submitted|
|verificationDocumentStatus|pending|
|verificationDocumentStatus|approved|
|verificationDocumentStatus|rejected|

<aside class="success">
This operation does not require authentication
</aside>

## Get user profile

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/auth/profile \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/auth/profile`

Retrieve authenticated user's profile information including wallet balance

> Example responses

> 200 Response

```json
{
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "phone": "string",
    "firstName": "string",
    "lastName": "string",
    "displayName": "string",
    "listenerSignature": "string",
    "verificationDocumentStatus": "not_submitted",
    "profilePictureUrl": "http://example.com",
    "bio": "string",
    "dateOfBirth": "2019-08-24",
    "userType": "venter",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  },
  "security": {
    "twoFactorAuthentication": {
      "enabled": true,
      "method": "authenticator_app"
    }
  },
  "preferences": {
    "genderIdentity": "Man",
    "culturalBackground": "Black",
    "ethnicity": "African Diaspora",
    "ageGroup": "18-24",
    "lgbtqIdentity": "Gay",
    "specialTopics": [
      "Mental Health"
    ],
    "faithOrBelief": "Christian",
    "preferredLanguage": "en"
  },
  "wallet": {
    "balanceMinutes": 0,
    "balanceCurrency": 0,
    "autoRechargeEnabled": true
  }
}
```

<h3 id="get-user-profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Profile retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Profile not found|[Error](#schemaerror)|

<h3 id="get-user-profile-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» user|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string¦null|false|none|none|
|»» firstName|string¦null|false|none|none|
|»» lastName|string¦null|false|none|none|
|»» displayName|string¦null|false|none|none|
|»» listenerSignature|string¦null|false|none|none|
|»» verificationDocumentStatus|string¦null|false|none|none|
|»» profilePictureUrl|string(uri)¦null|false|none|none|
|»» bio|string¦null|false|none|none|
|»» dateOfBirth|string(date)¦null|false|none|none|
|»» userType|string|false|none|none|
|»» isVerified|boolean|false|none|none|
|»» isActive|boolean|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|
|» security|object|false|none|none|
|»» twoFactorAuthentication|[TwoFactorAuthentication](#schematwofactorauthentication)|false|none|none|
|»»» enabled|boolean|false|none|none|
|»»» method|string¦null|false|none|none|
|» preferences|object|false|none|none|
|»» genderIdentity|string¦null|false|none|none|
|»» culturalBackground|string¦null|false|none|none|
|»» ethnicity|string¦null|false|none|none|
|»» ageGroup|string¦null|false|none|none|
|»» lgbtqIdentity|string¦null|false|none|none|
|»» specialTopics|[string]|false|none|none|
|»» faithOrBelief|string¦null|false|none|none|
|»» preferredLanguage|string|false|none|none|
|» wallet|object|false|none|none|
|»» balanceMinutes|number|false|none|none|
|»» balanceCurrency|number|false|none|none|
|»» autoRechargeEnabled|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|verificationDocumentStatus|not_submitted|
|verificationDocumentStatus|pending|
|verificationDocumentStatus|approved|
|verificationDocumentStatus|rejected|
|userType|venter|
|userType|listener|
|method|sms|
|method|email|
|method|authenticator_app|
|genderIdentity|Man|
|genderIdentity|Woman|
|genderIdentity|Non-binary|
|genderIdentity|Gender non-conforming|
|genderIdentity|Questioning|
|genderIdentity|Prefer not to say|
|culturalBackground|Black|
|culturalBackground|White|
|culturalBackground|Asian|
|culturalBackground|Native Indian|
|culturalBackground|Pacific Islander|
|culturalBackground|Middle Eastern|
|culturalBackground|North African|
|culturalBackground|Multiracial|
|culturalBackground|Other|
|ethnicity|African Diaspora|
|ethnicity|Caribbean|
|ethnicity|North African|
|ethnicity|Hispanic|
|ethnicity|Pacific Islander|
|ethnicity|Middle Eastern|
|ethnicity|Asian|
|ethnicity|Indigenous|
|ethnicity|European|
|ethnicity|Multiple|
|ethnicity|Other|
|ethnicity|Prefer not to say|
|ageGroup|18-24|
|ageGroup|25-34|
|ageGroup|35-44|
|ageGroup|45-54|
|ageGroup|55-64|
|ageGroup|65+|
|ageGroup|Prefer not to say|
|lgbtqIdentity|Gay|
|lgbtqIdentity|Lesbian|
|lgbtqIdentity|Bisexual|
|lgbtqIdentity|Pansexual|
|lgbtqIdentity|Asexual|
|lgbtqIdentity|Queer|
|lgbtqIdentity|Questioning|
|lgbtqIdentity|Straight/Heterosexual|
|lgbtqIdentity|Prefer not to say|
|faithOrBelief|Christian|
|faithOrBelief|Muslim|
|faithOrBelief|Sikh|
|faithOrBelief|Hindu|
|faithOrBelief|Buddhist|
|faithOrBelief|Jewish|
|faithOrBelief|No religion|
|faithOrBelief|Spiritual (not religious)|
|faithOrBelief|Other|
|preferredLanguage|en|
|preferredLanguage|pt|
|preferredLanguage|es|
|preferredLanguage|fr|
|preferredLanguage|it|
|preferredLanguage|de|
|preferredLanguage|nl|
|preferredLanguage|ar|
|preferredLanguage|zh|
|preferredLanguage|ja|
|preferredLanguage|ko|
|preferredLanguage|hi|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update user profile

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/auth/profile \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "JohnD",
  "phone": "+1234567890",
  "profilePictureUrl": "https://example.com/profile.jpg",
  "bio": "Passionate listener with 5 years of experience",
  "dateOfBirth": "1990-01-15",
  "genderIdentity": "Non-binary",
  "culturalBackground": "Asian",
  "ethnicity": "Asian",
  "ageGroup": "25-34",
  "lgbtqIdentity": "Bisexual",
  "specialTopics": [
    "Mental Health",
    "Relationships"
  ],
  "faithOrBelief": "Buddhist",
  "preferredLanguage": "en"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/profile',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/auth/profile`

Update authenticated user's profile information. All fields are optional.

> Body parameter

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "JohnD",
  "phone": "+1234567890",
  "profilePictureUrl": "https://example.com/profile.jpg",
  "bio": "Passionate listener with 5 years of experience",
  "dateOfBirth": "1990-01-15",
  "genderIdentity": "Non-binary",
  "culturalBackground": "Asian",
  "ethnicity": "Asian",
  "ageGroup": "25-34",
  "lgbtqIdentity": "Bisexual",
  "specialTopics": [
    "Mental Health",
    "Relationships"
  ],
  "faithOrBelief": "Buddhist",
  "preferredLanguage": "en"
}
```

<h3 id="update-user-profile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» firstName|body|string|false|User's first name|
|» lastName|body|string|false|User's last name|
|» displayName|body|string|false|Public display name|
|» phone|body|string|false|Phone number in E.164 format|
|» profilePictureUrl|body|string(uri)|false|URL to profile picture|
|» bio|body|string|false|User biography or description|
|» dateOfBirth|body|string(date)|false|Date of birth (must be at least 13 years old)|
|» genderIdentity|body|string|false|User's gender identity|
|» culturalBackground|body|string|false|User's cultural or racial background|
|» ethnicity|body|string|false|User's ethnicity|
|» ageGroup|body|string|false|User's age range|
|» lgbtqIdentity|body|string|false|User's LGBTQ+ identity|
|» specialTopics|body|[string]|false|Topics user is interested in discussing|
|» faithOrBelief|body|string|false|User's faith or belief system|
|» preferredLanguage|body|string|false|User's preferred language code (ISO 639-1)|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» genderIdentity|Man|
|» genderIdentity|Woman|
|» genderIdentity|Non-binary|
|» genderIdentity|Gender non-conforming|
|» genderIdentity|Questioning|
|» genderIdentity|Prefer not to say|
|» culturalBackground|Black|
|» culturalBackground|White|
|» culturalBackground|Asian|
|» culturalBackground|Native Indian|
|» culturalBackground|Pacific Islander|
|» culturalBackground|Middle Eastern|
|» culturalBackground|North African|
|» culturalBackground|Multiracial|
|» culturalBackground|Other|
|» ethnicity|African Diaspora|
|» ethnicity|Caribbean|
|» ethnicity|North African|
|» ethnicity|Hispanic|
|» ethnicity|Pacific Islander|
|» ethnicity|Middle Eastern|
|» ethnicity|Asian|
|» ethnicity|Indigenous|
|» ethnicity|European|
|» ethnicity|Multiple|
|» ethnicity|Other|
|» ethnicity|Prefer not to say|
|» ageGroup|18-24|
|» ageGroup|25-34|
|» ageGroup|35-44|
|» ageGroup|45-54|
|» ageGroup|55-64|
|» ageGroup|65+|
|» ageGroup|Prefer not to say|
|» lgbtqIdentity|Gay|
|» lgbtqIdentity|Lesbian|
|» lgbtqIdentity|Bisexual|
|» lgbtqIdentity|Pansexual|
|» lgbtqIdentity|Asexual|
|» lgbtqIdentity|Queer|
|» lgbtqIdentity|Questioning|
|» lgbtqIdentity|Straight/Heterosexual|
|» lgbtqIdentity|Prefer not to say|
|» specialTopics|Mental Health|
|» specialTopics|Life & Identity|
|» specialTopics|Relationships|
|» specialTopics|Work & Money|
|» specialTopics|Health & Medical|
|» specialTopics|Work & Finances|
|» faithOrBelief|Christian|
|» faithOrBelief|Muslim|
|» faithOrBelief|Sikh|
|» faithOrBelief|Hindu|
|» faithOrBelief|Buddhist|
|» faithOrBelief|Jewish|
|» faithOrBelief|No religion|
|» faithOrBelief|Spiritual (not religious)|
|» faithOrBelief|Other|
|» preferredLanguage|en|
|» preferredLanguage|pt|
|» preferredLanguage|es|
|» preferredLanguage|fr|
|» preferredLanguage|it|
|» preferredLanguage|de|
|» preferredLanguage|nl|
|» preferredLanguage|ar|
|» preferredLanguage|zh|
|» preferredLanguage|ja|
|» preferredLanguage|ko|
|» preferredLanguage|hi|

> Example responses

> 200 Response

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "phone": "string",
    "firstName": "string",
    "lastName": "string",
    "displayName": "string",
    "profilePictureUrl": "http://example.com",
    "bio": "string",
    "dateOfBirth": "2019-08-24",
    "userType": "venter",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  },
  "preferences": {
    "genderIdentity": "string",
    "culturalBackground": "string",
    "ethnicity": "string",
    "ageGroup": "string",
    "lgbtqIdentity": "string",
    "specialTopics": [
      "string"
    ],
    "faithOrBelief": "string",
    "preferredLanguage": "string"
  }
}
```

> Invalid input data

```json
{
  "error": "Invalid first name",
  "message": "First name must be 100 characters or less"
}
```

```json
{
  "error": "Invalid phone number",
  "message": "Please provide a valid phone number in E.164 format"
}
```

```json
{
  "error": "Invalid date of birth",
  "message": "You must be at least 13 years old to use this service"
}
```

<h3 id="update-user-profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Profile updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input data|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Profile not found|[Error](#schemaerror)|

<h3 id="update-user-profile-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string¦null|false|none|none|
|»» firstName|string¦null|false|none|none|
|»» lastName|string¦null|false|none|none|
|»» displayName|string¦null|false|none|none|
|»» profilePictureUrl|string(uri)¦null|false|none|none|
|»» bio|string¦null|false|none|none|
|»» dateOfBirth|string(date)¦null|false|none|none|
|»» userType|string|false|none|none|
|»» isVerified|boolean|false|none|none|
|»» isActive|boolean|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|
|» preferences|object|false|none|none|
|»» genderIdentity|string¦null|false|none|none|
|»» culturalBackground|string¦null|false|none|none|
|»» ethnicity|string¦null|false|none|none|
|»» ageGroup|string¦null|false|none|none|
|»» lgbtqIdentity|string¦null|false|none|none|
|»» specialTopics|[string]|false|none|none|
|»» faithOrBelief|string¦null|false|none|none|
|»» preferredLanguage|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|venter|
|userType|listener|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get two-factor authentication settings

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/auth/security/2fa \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/security/2fa',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/auth/security/2fa`

Get the authenticated user's 2FA configuration

> Example responses

> 200 Response

```json
{
  "success": true,
  "twoFactorAuthentication": {
    "enabled": true,
    "method": "authenticator_app"
  }
}
```

<h3 id="get-two-factor-authentication-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|2FA settings retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<h3 id="get-two-factor-authentication-settings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» twoFactorAuthentication|[TwoFactorAuthentication](#schematwofactorauthentication)|false|none|none|
|»» enabled|boolean|false|none|none|
|»» method|string¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|method|sms|
|method|email|
|method|authenticator_app|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update two-factor authentication settings

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/auth/security/2fa \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "enabled": true,
  "method": "email"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/security/2fa',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/auth/security/2fa`

Enable or disable 2FA and choose a single active method (sms, email, authenticator_app)

> Body parameter

```json
{
  "enabled": true,
  "method": "email"
}
```

<h3 id="update-two-factor-authentication-settings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» enabled|body|boolean|true|none|
|» method|body|string¦null|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» method|sms|
|» method|email|
|» method|authenticator_app|

> Example responses

> 401 Response

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}
```

<h3 id="update-two-factor-authentication-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|2FA settings updated successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Refresh access token

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/refresh-token \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/refresh-token',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/refresh-token`

Get a new access token using refresh token

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="refresh-access-token-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» refreshToken|body|string|true|Valid refresh token|

> Example responses

> 200 Response

```json
{
  "accessToken": "string"
}
```

<h3 id="refresh-access-token-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Token refreshed successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid or expired refresh token|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<h3 id="refresh-access-token-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» accessToken|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Verify email address with OTP

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/verify-email \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "otp": "1234"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/verify-email',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/verify-email`

Verify user email address using a 4-digit OTP code sent via email

> Body parameter

```json
{
  "email": "user@example.com",
  "otp": "1234"
}
```

<h3 id="verify-email-address-with-otp-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|User's email address|
|» otp|body|string|true|4-digit verification code|

> Example responses

> 200 Response

```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "string",
    "email": "string",
    "isVerified": true
  }
}
```

> Invalid OTP, expired code, or validation error

```json
{
  "error": "Invalid OTP",
  "message": "Incorrect verification code. 4 attempts remaining."
}
```

```json
{
  "error": "OTP expired",
  "message": "Verification code has expired. Please request a new one."
}
```

```json
{
  "error": "Too many attempts",
  "message": "Maximum verification attempts exceeded. Please request a new code."
}
```

<h3 id="verify-email-address-with-otp-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Email verified successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid OTP, expired code, or validation error|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="verify-email-address-with-otp-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|object|false|none|none|
|»» id|string|false|none|none|
|»» email|string|false|none|none|
|»» isVerified|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Resend verification email

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/resend-verification \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/resend-verification',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/resend-verification`

Request a new verification email to be sent to the user's email address

> Body parameter

```json
{
  "email": "user@example.com"
}
```

<h3 id="resend-verification-email-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|Email address to send verification link to|

> Example responses

> 200 Response

```json
{
  "message": "If the email exists and is not verified, a verification link has been sent"
}
```

<h3 id="resend-verification-email-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification email sent (if email exists and is unverified)|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="resend-verification-email-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Request password reset

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/request-password-reset \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/request-password-reset',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/request-password-reset`

Request a password reset OTP code to be sent to user email

> Body parameter

```json
{
  "email": "user@example.com"
}
```

<h3 id="request-password-reset-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|User's email address|

> Example responses

> 200 Response

```json
{
  "message": "If the email exists, a password reset code has been sent"
}
```

<h3 id="request-password-reset-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password reset code sent|Inline|

<h3 id="request-password-reset-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Reset password with OTP

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/reset-password \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "otp": "5678",
  "newPassword": "NewSecurePass123!"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/reset-password',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/reset-password`

Reset user password using a 4-digit OTP code

> Body parameter

```json
{
  "email": "user@example.com",
  "otp": "5678",
  "newPassword": "NewSecurePass123!"
}
```

<h3 id="reset-password-with-otp-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|User's email address|
|» otp|body|string|true|4-digit password reset code|
|» newPassword|body|string(password)|true|Must contain uppercase, lowercase, number, and special character|

> Example responses

> 200 Response

```json
{
  "message": "Password reset successfully. Please login with your new password."
}
```

> Invalid OTP, expired code, or password requirements not met

```json
{
  "error": "Invalid OTP",
  "message": "Incorrect reset code. 3 attempts remaining."
}
```

```json
{
  "error": "OTP expired",
  "message": "Password reset code has expired. Please request a new one."
}
```

```json
{
  "error": "Weak password",
  "message": "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
}
```

<h3 id="reset-password-with-otp-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password reset successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid OTP, expired code, or password requirements not met|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="reset-password-with-otp-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Change password

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/change-password \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "currentPassword": "CurrentSecurePass123!",
  "newPassword": "NewSecurePass123!"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/change-password',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/change-password`

Change authenticated user's password using current password verification

> Body parameter

```json
{
  "currentPassword": "CurrentSecurePass123!",
  "newPassword": "NewSecurePass123!"
}
```

<h3 id="change-password-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» currentPassword|body|string(password)|true|User's current password|
|» newPassword|body|string(password)|true|Must contain uppercase, lowercase, number, and special character|

> Example responses

> 200 Response

```json
{
  "message": "Password changed successfully. Please login again."
}
```

<h3 id="change-password-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Password changed successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Missing fields, weak password, or invalid new password|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized or invalid current password|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[Error](#schemaerror)|

<h3 id="change-password-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Request OTP to change email

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/change-email/request-otp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "newEmail": "new.email@example.com"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/change-email/request-otp',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/change-email/request-otp`

Send a 4-digit OTP to the new email address for authenticated email change

> Body parameter

```json
{
  "newEmail": "new.email@example.com"
}
```

<h3 id="request-otp-to-change-email-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» newEmail|body|string(email)|true|none|

<h3 id="request-otp-to-change-email-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification code sent|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Missing or invalid email|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Email already in use|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Verify OTP and change email

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/change-email/verify-otp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "newEmail": "new.email@example.com",
  "otp": "1234"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/change-email/verify-otp',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/change-email/verify-otp`

Verify 4-digit OTP for authenticated email change and update the email address

> Body parameter

```json
{
  "newEmail": "new.email@example.com",
  "otp": "1234"
}
```

<h3 id="verify-otp-and-change-email-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» newEmail|body|string(email)|true|none|
|» otp|body|string|true|none|

<h3 id="verify-otp-and-change-email-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Email updated successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid OTP, expired OTP, or missing request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Email already in use|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Request OTP to change phone

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/change-phone/request-otp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "newPhone": "+15551234567"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/change-phone/request-otp',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/change-phone/request-otp`

Send a 4-digit OTP to the new phone number for authenticated phone change

> Body parameter

```json
{
  "newPhone": "+15551234567"
}
```

<h3 id="request-otp-to-change-phone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» newPhone|body|string|true|Phone number in E.164 format|

<h3 id="request-otp-to-change-phone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification code sent|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Missing or invalid phone number|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Verify OTP and change phone

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/change-phone/verify-otp \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "newPhone": "+15551234567",
  "otp": "1234"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/change-phone/verify-otp',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/change-phone/verify-otp`

Verify 4-digit OTP for authenticated phone change and update the phone number

> Body parameter

```json
{
  "newPhone": "+15551234567",
  "otp": "1234"
}
```

<h3 id="verify-otp-and-change-phone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» newPhone|body|string|true|Phone number in E.164 format|
|» otp|body|string|true|none|

<h3 id="verify-otp-and-change-phone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Phone number updated successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid OTP, expired OTP, or missing request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Logout user

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/logout \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/logout',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/logout`

Invalidate user session and refresh token

> Example responses

> 200 Response

```json
{
  "message": "string"
}
```

<h3 id="logout-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Logged out successfully|[Success](#schemasuccess)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Delete user account

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/auth/account \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "password": "MySecurePassword123!"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/account',
{
  method: 'DELETE',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/auth/account`

Permanently delete user account with password verification. This action cannot be undone and will remove all associated data including wallet, reviews, messages, and call history.

> Body parameter

```json
{
  "password": "MySecurePassword123!"
}
```

<h3 id="delete-user-account-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» password|body|string|true|User's current password for verification|

> Example responses

> 200 Response

```json
{
  "message": "Account deleted successfully",
  "email": "user@example.com"
}
```

<h3 id="delete-user-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Account deleted successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request - Missing password|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid password or token|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|[Error](#schemaerror)|

<h3 id="delete-user-account-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» email|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Register biometric authentication (Face ID / Fingerprint)

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/biometric/register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  "deviceId": "iPhone12,1_A1B2C3D4E5F6",
  "deviceName": "iPhone 13 Pro"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/biometric/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/biometric/register`

Register Face ID or Fingerprint authentication for the authenticated user. The mobile app should generate a public/private key pair and send the public key along with device information.

> Body parameter

```json
{
  "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  "deviceId": "iPhone12,1_A1B2C3D4E5F6",
  "deviceName": "iPhone 13 Pro"
}
```

<h3 id="register-biometric-authentication-(face-id-/-fingerprint)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» publicKey|body|string|true|Base64 encoded public key generated by the mobile device|
|» deviceId|body|string|true|Unique device identifier|
|» deviceName|body|string|false|Human-readable device name (optional)|

> Example responses

> 200 Response

```json
{
  "message": "Biometric authentication registered successfully",
  "biometric": {
    "enabled": true,
    "deviceName": "iPhone 13 Pro",
    "registeredAt": "2026-01-30T12:00:00.000Z"
  }
}
```

> Invalid input data

```json
{
  "error": "Invalid public key",
  "message": "Public key must be a valid base64 encoded string"
}
```

```json
{
  "error": "Invalid device ID",
  "message": "Device ID must be between 10 and 255 characters"
}
```

<h3 id="register-biometric-authentication-(face-id-/-fingerprint)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Biometric authentication registered successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input data|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - valid JWT token required|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="register-biometric-authentication-(face-id-/-fingerprint)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» biometric|object|false|none|none|
|»» enabled|boolean|false|none|none|
|»» deviceName|string|false|none|none|
|»» registeredAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Login with biometric authentication

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/biometric/login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "deviceId": "iPhone12,1_A1B2C3D4E5F6",
  "challenge": "1706616000000",
  "signature": "SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBzaWduYXR1cmU="
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/biometric/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/biometric/login`

Authenticate user using Face ID or Fingerprint. The mobile app must sign a challenge with the private key and send the signature for verification.

> Body parameter

```json
{
  "email": "user@example.com",
  "deviceId": "iPhone12,1_A1B2C3D4E5F6",
  "challenge": "1706616000000",
  "signature": "SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBzaWduYXR1cmU="
}
```

<h3 id="login-with-biometric-authentication-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|User's email address|
|» deviceId|body|string|true|Device ID used during biometric registration|
|» challenge|body|string|true|Random challenge string (should be a timestamp or nonce)|
|» signature|body|string|true|Base64 encoded signature of the challenge signed with device private key|

> Example responses

> 200 Response

```json
{
  "message": "Login successful",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "userType": "venter",
    "activeRole": "venter",
    "availableRoles": [
      "venter",
      "listener"
    ],
    "phone": "string",
    "displayName": "string",
    "preferredLanguage": "en",
    "listenerSignature": "string",
    "verificationDocumentStatus": "not_submitted",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2019-08-24T14:15:22Z"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

> Invalid input data

```json
{
  "error": "Missing required fields",
  "message": "Device ID, signature, challenge, and email are required"
}
```

```json
{
  "error": "Invalid signature",
  "message": "Signature must be a valid base64 encoded string"
}
```

> Authentication failed

```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

<h3 id="login-with-biometric-authentication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Biometric login successful|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid input data|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Authentication failed|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Account disabled|[Error](#schemaerror)|

<h3 id="login-with-biometric-authentication-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|[User](#schemauser)|false|none|none|
|»» id|string(uuid)|false|none|User unique identifier|
|»» email|string(email)|false|none|User email address|
|»» userType|string|false|none|User role type (equals activeRole, kept for backward compatibility)|
|»» activeRole|string|false|none|Currently active role|
|»» availableRoles|[string]|false|none|All roles user can switch between|
|»» phone|string|false|none|User phone number|
|»» displayName|string¦null|false|none|Public display name of the user|
|»» preferredLanguage|string¦null|false|none|Preferred language code (for example: en, pt, es)|
|»» listenerSignature|string¦null|false|none|Listener signature URL or base64 value|
|»» verificationDocumentStatus|string¦null|false|none|Current listener verification document status|
|»» isVerified|boolean|false|none|Email verification status|
|»» isActive|boolean|false|none|Account active status|
|»» createdAt|string(date-time)|false|none|Account creation timestamp|
|» tokens|[Tokens](#schematokens)|false|none|none|
|»» accessToken|string|false|none|JWT access token (expires in 7 days)|
|»» refreshToken|string|false|none|JWT refresh token (expires in 30 days)|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|venter|
|userType|listener|
|userType|admin|
|userType|sub_admin|
|activeRole|venter|
|activeRole|listener|
|activeRole|admin|
|activeRole|sub_admin|
|verificationDocumentStatus|not_submitted|
|verificationDocumentStatus|pending|
|verificationDocumentStatus|approved|
|verificationDocumentStatus|rejected|

<aside class="success">
This operation does not require authentication
</aside>

## Disable biometric authentication

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/auth/biometric/disable \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/biometric/disable',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/auth/biometric/disable`

Disable Face ID / Fingerprint authentication for the authenticated user

> Example responses

> 200 Response

```json
{
  "message": "Biometric authentication disabled successfully",
  "biometric": {
    "enabled": false
  }
}
```

<h3 id="disable-biometric-authentication-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Biometric authentication disabled successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - valid JWT token required|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="disable-biometric-authentication-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» biometric|object|false|none|none|
|»» enabled|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get biometric authentication status

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/auth/biometric/status \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/auth/biometric/status',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/auth/biometric/status`

Check if biometric authentication is enabled and get device information

> Example responses

> 200 Response

```json
{
  "biometric": {
    "enabled": true,
    "deviceName": "iPhone 13 Pro",
    "registeredAt": "2026-01-30T12:00:00.000Z"
  }
}
```

<h3 id="get-biometric-authentication-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Biometric status retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - valid JWT token required|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="get-biometric-authentication-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» biometric|object|false|none|none|
|»» enabled|boolean|false|none|Whether biometric authentication is enabled|
|»» deviceName|string¦null|false|none|Name of registered device|
|»» registeredAt|string(date-time)¦null|false|none|When biometric auth was registered|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-wallet">Wallet</h1>

Wallet balance and transaction management endpoints

## Get wallet balance

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/wallet/balance \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/wallet/balance',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/wallet/balance`

Retrieve authenticated user's wallet balance and auto-recharge settings

> Example responses

> 200 Response

```json
{
  "balance": {
    "minutes": 120.5,
    "currency": 50,
    "currencyCode": "USD"
  },
  "autoRecharge": {
    "enabled": true,
    "threshold": 10,
    "amount": 20
  }
}
```

<h3 id="get-wallet-balance-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Wallet information retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Wallet not found|[Error](#schemaerror)|

<h3 id="get-wallet-balance-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» balance|object|false|none|none|
|»» minutes|number|false|none|none|
|»» currency|number|false|none|none|
|»» currencyCode|string|false|none|none|
|» autoRecharge|object|false|none|none|
|»» enabled|boolean|false|none|none|
|»» threshold|number|false|none|none|
|»» amount|number|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get transaction history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/wallet/transactions \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/wallet/transactions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/wallet/transactions`

Retrieve user's transaction history with pagination

<h3 id="get-transaction-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Number of transactions to return|
|offset|query|integer|false|Number of transactions to skip|

> Example responses

> 200 Response

```json
{
  "transactions": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "type": "credit_purchase",
      "amountMinutes": 10.5,
      "amountCurrency": 5.25,
      "balanceAfterMinutes": 120.5,
      "balanceAfterCurrency": 60,
      "description": "Added 10 calling minutes",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 0,
    "offset": 0
  }
}
```

<h3 id="get-transaction-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Transactions retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="get-transaction-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» transactions|[[Transaction](#schematransaction)]|false|none|none|
|»» id|string(uuid)|false|none|Transaction unique identifier|
|»» type|string|false|none|Transaction type|
|»» amountMinutes|number|false|none|Minutes amount (positive for credits, negative for deductions)|
|»» amountCurrency|number|false|none|Currency amount in USD|
|»» balanceAfterMinutes|number|false|none|Wallet balance in minutes after transaction|
|»» balanceAfterCurrency|number|false|none|Wallet balance in currency after transaction|
|»» description|string|false|none|Transaction description|
|»» createdAt|string(date-time)|false|none|Transaction timestamp|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|credit_purchase|
|type|call_deduction|
|type|subscription_charge|
|type|refund|
|type|auto_recharge|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get subscription status

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/wallet/subscription \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/wallet/subscription',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/wallet/subscription`

Retrieve user's active subscription details

> Example responses

> 200 Response

```json
{
  "hasSubscription": true,
  "message": "string",
  "subscription": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "planName": "Premium",
    "status": "active",
    "includedMinutes": 300,
    "usedMinutes": 45.5,
    "remainingMinutes": 254.5,
    "overageRate": 0.25,
    "billingCycleStart": "2019-08-24",
    "billingCycleEnd": "2019-08-24",
    "monthlyPrice": 29.99,
    "features": {}
  }
}
```

<h3 id="get-subscription-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription information retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="get-subscription-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» hasSubscription|boolean|false|none|none|
|» message|string|false|none|none|
|» subscription|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» planName|string|false|none|none|
|»» status|string|false|none|none|
|»» includedMinutes|integer|false|none|none|
|»» usedMinutes|number|false|none|none|
|»» remainingMinutes|number|false|none|none|
|»» overageRate|number|false|none|none|
|»» billingCycleStart|string(date)|false|none|none|
|»» billingCycleEnd|string(date)|false|none|none|
|»» monthlyPrice|number|false|none|none|
|»» features|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update auto-recharge settings

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/wallet/auto-recharge \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "enabled": true,
  "threshold": 10,
  "amount": 20
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/wallet/auto-recharge',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/wallet/auto-recharge`

Configure automatic wallet recharge when balance falls below threshold

> Body parameter

```json
{
  "enabled": true,
  "threshold": 10,
  "amount": 20
}
```

<h3 id="update-auto-recharge-settings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» enabled|body|boolean|true|none|
|» threshold|body|number|false|Required if enabled=true|
|» amount|body|number|false|Required if enabled=true|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "autoRecharge": {
    "enabled": true,
    "threshold": 0,
    "amount": 0
  }
}
```

<h3 id="update-auto-recharge-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Auto-recharge settings updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request - missing required fields|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - email not verified|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Wallet not found|[Error](#schemaerror)|

<h3 id="update-auto-recharge-settings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» autoRecharge|object|false|none|none|
|»» enabled|boolean|false|none|none|
|»» threshold|number|false|none|none|
|»» amount|number|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-payments">Payments</h1>

Payment processing and wallet recharge endpoints

## Get available credit packs

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/payments/credit-packs \
  -H 'Accept: application/json'

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/payments/credit-packs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/payments/credit-packs`

Retrieve all available prepaid credit packages for purchasing calling minutes

> Example responses

> 200 Response

```json
{
  "packs": [
    {
      "id": "voice_top_up",
      "name": "Voice Top-Up",
      "minutes": 15,
      "price": 19.99,
      "pricePerMinute": "1.333",
      "included_minutes": 15,
      "included_messages": null,
      "description": "Extend your call"
    },
    {
      "id": "text_top_up",
      "name": "Text Top-Up",
      "minutes": 0,
      "price": 14.99,
      "pricePerMinute": null,
      "included_minutes": null,
      "included_messages": 50,
      "description": "Continue your conversation"
    },
    {
      "id": "support_boost",
      "name": "Support Boost",
      "minutes": 30,
      "price": 34.99,
      "pricePerMinute": "1.166",
      "included_minutes": 30,
      "included_messages": 50,
      "description": "Extra time when you need it"
    }
  ]
}
```

> 500 Response

```json
{
  "error": "string"
}
```

<h3 id="get-available-credit-packs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Credit packs retrieved successfully|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-available-credit-packs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» packs|[object]|false|none|none|
|»» id|string|false|none|Pack identifier|
|»» name|string|false|none|none|
|»» minutes|integer|false|none|Number of minutes included|
|»» price|number|false|none|Price in USD|
|»» pricePerMinute|string,null|false|none|Price per minute when minutes are included; null for message-only packs|
|»» included_minutes|integer¦null|false|none|Optional included voice minutes for this pack|
|»» included_messages|integer¦null|false|none|Optional included text messages for this pack|
|»» description|string|false|none|Human-readable pack details|

<aside class="success">
This operation does not require authentication
</aside>

## Get subscription plans

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/payments/subscription-plans \
  -H 'Accept: application/json'

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/payments/subscription-plans',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/payments/subscription-plans`

Retrieve all active subscription plans with billing fields and subscription-screen display copy

> Example responses

> 200 Response

```json
{
  "catalogVersion": "2026-03-mobile-v3",
  "plans": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Free Trial",
      "price_monthly": 0,
      "included_minutes": 10,
      "included_messages_monthly": 30,
      "overage_rate": 0.1,
      "trial_days": 0,
      "features": {
        "emotional_wellness_tools": true
      },
      "is_active": true,
      "stripe_price_id": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "name": "Light Support",
      "price_monthly": 34.99,
      "included_minutes": 30,
      "included_messages_monthly": 150,
      "overage_rate": 0.1,
      "trial_days": 0,
      "features": {
        "emotional_wellness_tools": true
      },
      "is_active": true,
      "stripe_price_id": "price_0987654321",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "display": {
        "minuteText": "30 minutes",
        "annualPrice": 379,
        "annualPriceLabel": "$379 / year",
        "monthlyPriceLabel": "$34.99 / month",
        "overageText": "$0.10 per additional minute",
        "isMostPopular": false,
        "mostPopularBadge": null
      }
    },
    {
      "id": "323e4567-e89b-12d3-a456-426614174002",
      "name": "Balanced Support",
      "price_monthly": 64.99,
      "included_minutes": 60,
      "included_messages_monthly": 300,
      "overage_rate": 0.1,
      "trial_days": 0,
      "features": {
        "emotional_wellness_tools": true
      },
      "is_active": true,
      "stripe_price_id": "price_1234567890",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "display": {
        "minuteText": "60 minutes",
        "annualPrice": 699,
        "annualPriceLabel": "$699 / year",
        "monthlyPriceLabel": "$64.99 / month",
        "overageText": "$0.10 per additional minute",
        "isMostPopular": true,
        "mostPopularBadge": {
          "text": "Most Popular",
          "color": "pale_pink"
        }
      }
    }
  ],
  "screenCopy": {
    "header": {
      "title": "Choose Your Plan",
      "titleAlignment": "center",
      "backArrowAlignment": "left"
    },
    "planToggle": {
      "defaultCycle": "annual",
      "tabs": [
        {
          "id": "annual",
          "label": "Annual",
          "badge": {
            "text": "Save 20%",
            "color": "pale_pink",
            "textColor": "white",
            "shape": "pill",
            "size": "small"
          }
        },
        {
          "id": "monthly",
          "label": "Monthly"
        }
      ]
    },
    "promo": {
      "label": "Promo Code",
      "placeholder": "Add promo code",
      "size": "small"
    },
    "advancedPlansLink": {
      "text": "See advanced plans",
      "placement": "below_plan_cards",
      "style": "subtle"
    },
    "continueButton": {
      "color": "ventally_pink",
      "alignment": "center",
      "textOptions": [
        "Continue to Secure Checkout",
        "Start My Support Plan"
      ]
    },
    "trustText": "Cancel anytime. Conversations remain private.",
    "layoutOrder": [
      "back_arrow",
      "choose_your_plan",
      "annual_monthly_toggle",
      "plan_cards",
      "see_advanced_plans",
      "promo_code",
      "continue_button",
      "privacy_reassurance_text"
    ]
  }
}
```

> 500 Response

```json
{
  "error": "Failed to fetch subscription plans"
}
```

<h3 id="get-subscription-plans-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription plans retrieved successfully|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-subscription-plans-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» plans|[object]|false|none|none|
|»» id|string(uuid)|false|none|Plan unique identifier|
|»» name|string|false|none|Plan name|
|»» price_monthly|number|false|none|Monthly subscription price in USD|
|»» included_minutes|integer|false|none|Minutes included per month|
|»» included_messages_monthly|integer|false|none|Messages included per month|
|»» overage_rate|number|false|none|Rate per minute for usage beyond included minutes|
|»» trial_days|integer|false|none|Trial duration in days applied at checkout (if > 0)|
|»» features|object¦null|false|none|Additional plan features (JSON)|
|»» is_active|boolean|false|none|none|
|»» stripe_price_id|string¦null|false|none|Stripe price ID for billing|
|»» stripe_price_id_annual|string¦null|false|none|Stripe annual price ID for annual billing|
|»» created_at|string(date-time)|false|none|none|
|»» updated_at|string(date-time)|false|none|none|
|»» display|object|false|none|Screen-ready labels and metadata for subscription plan cards|
|»»» minuteText|string|false|none|none|
|»»» annualPrice|number|false|none|none|
|»»» annualPriceLabel|string|false|none|none|
|»»» annualSavings|number|false|none|none|
|»»» annualDiscountPercent|integer|false|none|none|
|»»» includedMessagesText|string|false|none|none|
|»»» monthlyPriceLabel|string|false|none|none|
|»»» overageText|string|false|none|none|
|»»» isMostPopular|boolean|false|none|none|
|»»» mostPopularBadge|object¦null|false|none|none|
|»»»» text|string|false|none|none|
|»»»» color|string|false|none|none|
|» screenCopy|object|false|none|Subscription screen copy and layout metadata for mobile UI|
|» catalogVersion|string|false|none|Version flag for mobile catalog compatibility|

<aside class="success">
This operation does not require authentication
</aside>

## Create checkout session for credit pack

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/payments/create-checkout-session \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "packType": "standard",
  "customMinutes": 0,
  "customPrice": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/payments/create-checkout-session',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/payments/create-checkout-session`

Create a Stripe checkout session for purchasing prepaid credit minutes

> Body parameter

```json
{
  "packType": "standard",
  "customMinutes": 0,
  "customPrice": 0
}
```

<h3 id="create-checkout-session-for-credit-pack-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» packType|body|string|true|Credit pack type to purchase|
|» customMinutes|body|integer|false|Custom minutes for special offers (optional)|
|» customPrice|body|number|false|Custom price in USD (optional)|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» packType|starter|
|» packType|standard|
|» packType|pro|
|» packType|premium|

> Example responses

> 200 Response

```json
{
  "sessionId": "string",
  "url": "http://example.com",
  "credits": 0,
  "amount": 0
}
```

<h3 id="create-checkout-session-for-credit-pack-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Checkout session created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid pack type|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="create-checkout-session-for-credit-pack-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» sessionId|string|false|none|Stripe checkout session ID|
|» url|string(uri)|false|none|Stripe checkout URL|
|» credits|integer|false|none|Minutes included in purchase|
|» amount|number|false|none|Total amount in USD|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Create checkout session for subscription

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/payments/create-subscription-checkout \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "planId": "b3f60ba2-c1fd-4b3a-a23d-8e876e0ef75d",
  "billingCycle": "annual"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/payments/create-subscription-checkout',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/payments/create-subscription-checkout`

Create a Stripe checkout session for subscribing to a monthly plan

> Body parameter

```json
{
  "planId": "b3f60ba2-c1fd-4b3a-a23d-8e876e0ef75d",
  "billingCycle": "annual"
}
```

<h3 id="create-checkout-session-for-subscription-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» planId|body|string(uuid)|true|Subscription plan ID|
|» billingCycle|body|string|false|Billing cycle for checkout. Defaults to monthly when omitted.|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» billingCycle|monthly|
|» billingCycle|annual|

> Example responses

> 200 Response

```json
{
  "sessionId": "string",
  "url": "http://example.com",
  "planName": "string",
  "monthlyPrice": 0,
  "includedMinutes": 0,
  "includedMessages": 0,
  "annualPrice": 0,
  "annualSavings": 0,
  "billingCycle": "monthly",
  "catalogVersion": "string"
}
```

<h3 id="create-checkout-session-for-subscription-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription checkout session created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid or missing plan ID|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Subscription plan not found|[Error](#schemaerror)|

<h3 id="create-checkout-session-for-subscription-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» sessionId|string|false|none|Stripe checkout session ID|
|» url|string(uri)|false|none|Stripe checkout URL|
|» planName|string|false|none|Name of the subscription plan|
|» monthlyPrice|number|false|none|Monthly price in USD|
|» includedMinutes|integer|false|none|Minutes included per month|
|» includedMessages|integer|false|none|Messages included per month|
|» annualPrice|number|false|none|Annual price displayed for selected plan|
|» annualSavings|number|false|none|Savings compared to monthly x 12|
|» billingCycle|string|false|none|Billing cycle used for this checkout|
|» catalogVersion|string|false|none|Version flag for mobile catalog compatibility|

#### Enumerated Values

|Property|Value|
|---|---|
|billingCycle|monthly|
|billingCycle|annual|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Verify checkout session

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/payments/verify-checkout?sessionId=cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0 \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/payments/verify-checkout?sessionId=cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/payments/verify-checkout`

Verify the status of a Stripe checkout session after payment completion

<h3 id="verify-checkout-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|query|string|true|Stripe checkout session ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "status": "paid",
  "amountPaid": 25,
  "credits": 300
}
```

> 400 Response

```json
{
  "error": "string"
}
```

<h3 id="verify-checkout-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Checkout session verified successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Session ID is required|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to verify checkout session|[Error](#schemaerror)|

<h3 id="verify-checkout-session-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|Whether payment was successful|
|» status|string|false|none|Payment status from Stripe|
|» amountPaid|number|false|none|Amount paid in USD|
|» credits|integer|false|none|Minutes credited to wallet|

#### Enumerated Values

|Property|Value|
|---|---|
|status|paid|
|status|unpaid|
|status|no_payment_required|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Cancel active subscription

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/payments/cancel-subscription \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/payments/cancel-subscription',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/payments/cancel-subscription`

Cancel the user's active subscription immediately.

> Example responses

> 200 Response

```json
{
  "message": "Subscription canceled immediately",
  "canceledAt": "2019-08-24T14:15:22Z"
}
```

> 404 Response

```json
{
  "error": "No active subscription found"
}
```

<h3 id="cancel-active-subscription-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription cancelled successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No active subscription found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to cancel subscription|[Error](#schemaerror)|

<h3 id="cancel-active-subscription-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» canceledAt|string(date-time)|false|none|Date when subscription was canceled|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-notifications">Notifications</h1>

Push notification management via Firebase Cloud Messaging (FCM)

## Get Firebase Cloud Messaging status

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/notifications/status \
  -H 'Accept: application/json'

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/status',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/notifications/status`

Check if Firebase is initialized and configured

> Example responses

> 200 Response

```json
{
  "success": true,
  "firebase": {
    "initialized": true,
    "credentialsConfigured": true,
    "status": "string",
    "message": "string"
  },
  "features": {
    "pushNotifications": true,
    "deviceTokenRegistration": true,
    "notificationHistory": true
  }
}
```

<h3 id="get-firebase-cloud-messaging-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Firebase status retrieved successfully|Inline|

<h3 id="get-firebase-cloud-messaging-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» firebase|object|false|none|none|
|»» initialized|boolean|false|none|none|
|»» credentialsConfigured|boolean|false|none|none|
|»» status|string|false|none|none|
|»» message|string|false|none|none|
|» features|object|false|none|none|
|»» pushNotifications|boolean|false|none|none|
|»» deviceTokenRegistration|boolean|false|none|none|
|»» notificationHistory|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Register a device token for push notifications

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "token": "fcm_token_12345...",
  "device_type": "android",
  "device_info": {
    "model": "Pixel 6",
    "os_version": "Android 13",
    "app_version": "1.0.0"
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/register`

Register FCM device token to receive push notifications

> Body parameter

```json
{
  "token": "fcm_token_12345...",
  "device_type": "android",
  "device_info": {
    "model": "Pixel 6",
    "os_version": "Android 13",
    "app_version": "1.0.0"
  }
}
```

<h3 id="register-a-device-token-for-push-notifications-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» token|body|string|true|FCM device token|
|» device_type|body|string|false|Device platform type|
|» device_info|body|object|false|Additional device information|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» device_type|android|
|» device_type|ios|
|» device_type|web|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "string"
}
```

<h3 id="register-a-device-token-for-push-notifications-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Device token registered successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<h3 id="register-a-device-token-for-push-notifications-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Unregister a device token

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/notifications/register \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "token": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/register',
{
  method: 'DELETE',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/notifications/register`

Remove device token from receiving push notifications

> Body parameter

```json
{
  "token": "string"
}
```

<h3 id="unregister-a-device-token-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» token|body|string|true|FCM device token to unregister|

<h3 id="unregister-a-device-token-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Device token unregistered successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Send dummy push notification (no auth)

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/test-send \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "token": "fcm_token_12345...",
  "title": "Test Notification",
  "body": "This is a test push notification from Swagger",
  "data": {
    "type": "test_notification",
    "source": "swagger"
  },
  "image_url": "https://example.com/notification.png"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/test-send',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/test-send`

Testing endpoint to send a push notification to a registered device without authentication. Provide either user_id (to target all active tokens for that user) or token (to target one device).

> Body parameter

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "token": "fcm_token_12345...",
  "title": "Test Notification",
  "body": "This is a test push notification from Swagger",
  "data": {
    "type": "test_notification",
    "source": "swagger"
  },
  "image_url": "https://example.com/notification.png"
}
```

<h3 id="send-dummy-push-notification-(no-auth)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» user_id|body|string|false|Target user ID with registered device tokens|
|» token|body|string|false|Direct FCM token target (alternative to user_id)|
|» title|body|string|false|none|
|» body|body|string|false|none|
|» data|body|object|false|Optional custom data payload|
|» image_url|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "result": {
    "target": "user_id",
    "deviceCount": 2,
    "successCount": 2,
    "failureCount": 0,
    "messageId": "string"
  }
}
```

<h3 id="send-dummy-push-notification-(no-auth)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Test notification sent|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Missing user_id/token|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No active device tokens found|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to send notification|None|

<h3 id="send-dummy-push-notification-(no-auth)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» result|object|false|none|none|
|»» target|string|false|none|none|
|»» deviceCount|integer|false|none|none|
|»» successCount|integer|false|none|none|
|»» failureCount|integer|false|none|none|
|»» messageId|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Send a push notification to a specific user

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/send \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "user_id": 123,
  "title": "Ventally",
  "body": "You have received a new message",
  "data": {
    "type": "message",
    "message_id": "456"
  },
  "image_url": "https://example.com/image.jpg"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/send',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/send`

Send push notification to all devices of a specific user

> Body parameter

```json
{
  "user_id": 123,
  "title": "Ventally",
  "body": "You have received a new message",
  "data": {
    "type": "message",
    "message_id": "456"
  },
  "image_url": "https://example.com/image.jpg"
}
```

<h3 id="send-a-push-notification-to-a-specific-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» user_id|body|integer|true|Target user ID|
|» title|body|string|true|Notification title|
|» body|body|string|true|Notification body text|
|» data|body|object|false|Additional data payload|
|» image_url|body|string|false|Optional notification image URL|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "string",
  "result": {
    "successCount": 0,
    "failureCount": 0
  }
}
```

<h3 id="send-a-push-notification-to-a-specific-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification sent successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No active devices found|None|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Firebase not configured|Inline|

<h3 id="send-a-push-notification-to-a-specific-user-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» result|object|false|none|none|
|»» successCount|integer|false|none|none|
|»» failureCount|integer|false|none|none|

Status Code **503**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Send a push notification to multiple users

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/send-bulk \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "user_ids": [
    123,
    456,
    789
  ],
  "title": "System Maintenance",
  "body": "Scheduled maintenance tonight",
  "data": {},
  "image_url": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/send-bulk',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/send-bulk`

Send same notification to multiple users at once

> Body parameter

```json
{
  "user_ids": [
    123,
    456,
    789
  ],
  "title": "System Maintenance",
  "body": "Scheduled maintenance tonight",
  "data": {},
  "image_url": "string"
}
```

<h3 id="send-a-push-notification-to-multiple-users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» user_ids|body|[integer]|true|Array of target user IDs|
|» title|body|string|true|none|
|» body|body|string|true|none|
|» data|body|object|false|none|
|» image_url|body|string|false|none|

<h3 id="send-a-push-notification-to-multiple-users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Bulk notification sent successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No active devices found|None|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Firebase not configured|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Send a push notification to a topic

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/send-topic \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "topic": "promotions",
  "title": "Special Offer!",
  "body": "Get 50% off today",
  "data": {},
  "image_url": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/send-topic',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/send-topic`

Send notification to all devices subscribed to a topic

> Body parameter

```json
{
  "topic": "promotions",
  "title": "Special Offer!",
  "body": "Get 50% off today",
  "data": {},
  "image_url": "string"
}
```

<h3 id="send-a-push-notification-to-a-topic-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» topic|body|string|true|Topic name|
|» title|body|string|true|none|
|» body|body|string|true|none|
|» data|body|object|false|none|
|» image_url|body|string|false|none|

<h3 id="send-a-push-notification-to-a-topic-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Topic notification sent successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Firebase not configured|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Subscribe user's devices to a topic

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/subscribe \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "topic": "promotions"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/subscribe',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/subscribe`

Subscribe all user devices to receive topic notifications

> Body parameter

```json
{
  "topic": "promotions"
}
```

<h3 id="subscribe-user's-devices-to-a-topic-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» topic|body|string|true|Topic to subscribe to|

<h3 id="subscribe-user's-devices-to-a-topic-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscribed to topic successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No active devices found|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Unsubscribe user's devices from a topic

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/notifications/unsubscribe \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "topic": "promotions"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/unsubscribe',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/notifications/unsubscribe`

Unsubscribe all user devices from topic notifications

> Body parameter

```json
{
  "topic": "promotions"
}
```

<h3 id="unsubscribe-user's-devices-from-a-topic-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» topic|body|string|true|Topic to unsubscribe from|

<h3 id="unsubscribe-user's-devices-from-a-topic-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Unsubscribed from topic successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No active devices found|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get notification history for the authenticated user

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/notifications/history \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/history',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/notifications/history`

Retrieve paginated notification history with read/unread status

<h3 id="get-notification-history-for-the-authenticated-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Maximum number of notifications to return|
|offset|query|integer|false|Number of notifications to skip|

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "title": "string",
      "body": "string",
      "data": {},
      "type": "string",
      "status": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "read_at": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 0,
  "limit": 0,
  "offset": 0
}
```

<h3 id="get-notification-history-for-the-authenticated-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification history retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<h3 id="get-notification-history-for-the-authenticated-user-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» data|[object]|false|none|none|
|»» id|integer|false|none|none|
|»» title|string|false|none|none|
|»» body|string|false|none|none|
|»» data|object|false|none|none|
|»» type|string|false|none|none|
|»» status|string|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» read_at|string(date-time)¦null|false|none|none|
|» total|integer|false|none|none|
|» limit|integer|false|none|none|
|» offset|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Mark a notification as read

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/notifications/{id}/read \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/{id}/read',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/notifications/{id}/read`

Update notification read status

<h3 id="mark-a-notification-as-read-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|Notification ID|

<h3 id="mark-a-notification-as-read-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification marked as read|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Notification not found or already read|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get unread notification count

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/notifications/unread-count \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/unread-count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/notifications/unread-count`

Get the count of unread notifications for the user

> Example responses

> 200 Response

```json
{
  "success": true,
  "unreadCount": 5
}
```

<h3 id="get-unread-notification-count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Unread count retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<h3 id="get-unread-notification-count-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» unreadCount|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get notification settings

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/notifications/settings \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/settings',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/notifications/settings`

Get notification preferences for the authenticated user

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "allNotifications": true,
    "messageNotifications": true,
    "callNotifications": true,
    "reminderNotifications": true,
    "soundVibration": true,
    "inAppAlerts": true,
    "activityStatus": true,
    "listenerReplyNotifications": true,
    "moodLogNotifications": true,
    "reflectionLogNotifications": true,
    "wellnessNudges": true,
    "remindMeAtUtc": "string",
    "quietHoursStartUtc": "string",
    "quietHoursEndUtc": "string"
  }
}
```

<h3 id="get-notification-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Settings retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<h3 id="get-notification-settings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» data|object|false|none|none|
|»» allNotifications|boolean|false|none|none|
|»» messageNotifications|boolean|false|none|none|
|»» callNotifications|boolean|false|none|none|
|»» reminderNotifications|boolean|false|none|none|
|»» soundVibration|boolean|false|none|none|
|»» inAppAlerts|boolean|false|none|none|
|»» activityStatus|boolean|false|none|none|
|»» listenerReplyNotifications|boolean|false|none|none|
|»» moodLogNotifications|boolean|false|none|none|
|»» reflectionLogNotifications|boolean|false|none|none|
|»» wellnessNudges|boolean|false|none|none|
|»» remindMeAtUtc|string¦null|false|none|none|
|»» quietHoursStartUtc|string¦null|false|none|none|
|»» quietHoursEndUtc|string¦null|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update notification settings

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/notifications/settings \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "allNotifications": true,
  "messageNotifications": true,
  "callNotifications": true,
  "reminderNotifications": true,
  "soundVibration": true,
  "inAppAlerts": true,
  "activityStatus": true,
  "listenerReplyNotifications": true,
  "moodLogNotifications": true,
  "reflectionLogNotifications": true,
  "wellnessNudges": true,
  "remindMeAtUtc": "20:00",
  "quietHoursStartUtc": "22:00",
  "quietHoursEndUtc": "07:00"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/notifications/settings',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/notifications/settings`

Update notification preferences including all notifications, channel toggles, reminder time, and quiet hours in UTC

> Body parameter

```json
{
  "allNotifications": true,
  "messageNotifications": true,
  "callNotifications": true,
  "reminderNotifications": true,
  "soundVibration": true,
  "inAppAlerts": true,
  "activityStatus": true,
  "listenerReplyNotifications": true,
  "moodLogNotifications": true,
  "reflectionLogNotifications": true,
  "wellnessNudges": true,
  "remindMeAtUtc": "20:00",
  "quietHoursStartUtc": "22:00",
  "quietHoursEndUtc": "07:00"
}
```

<h3 id="update-notification-settings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» allNotifications|body|boolean|false|none|
|» messageNotifications|body|boolean|false|none|
|» callNotifications|body|boolean|false|none|
|» reminderNotifications|body|boolean|false|none|
|» soundVibration|body|boolean|false|none|
|» inAppAlerts|body|boolean|false|none|
|» activityStatus|body|boolean|false|none|
|» listenerReplyNotifications|body|boolean|false|none|
|» moodLogNotifications|body|boolean|false|none|
|» reflectionLogNotifications|body|boolean|false|none|
|» wellnessNudges|body|boolean|false|none|
|» remindMeAtUtc|body|string|false|UTC time in HH:MM or HH:MM:SS|
|» quietHoursStartUtc|body|string¦null|false|none|
|» quietHoursEndUtc|body|string¦null|false|none|

> Example responses

> 401 Response

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}
```

<h3 id="update-notification-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Settings updated successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-mood">Mood</h1>

Daily mood logging and tracking for venter profiles

## Log mood for today

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/mood/log \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "mood_type": "Happy",
  "category": "Work",
  "notes": "Had a great day at work today!"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/mood/log',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/mood/log`

Log a mood entry for the current day. Only one entry per day is allowed. Only available for venter profiles.

> Body parameter

```json
{
  "mood_type": "Happy",
  "category": "Work",
  "notes": "Had a great day at work today!"
}
```

<h3 id="log-mood-for-today-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» mood_type|body|string|true|The mood type|
|» category|body|string|false|Optional category for the mood context|
|» notes|body|string|false|Optional notes about the mood|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» mood_type|Happy|
|» mood_type|Neutral|
|» mood_type|Sad|
|» mood_type|Anxious|
|» mood_type|Mad|
|» category|Work|
|» category|Family|
|» category|Health|
|» category|Unknown|

> Example responses

> 201 Response

```json
{
  "message": "Mood logged successfully",
  "mood": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "mood_type": "Happy",
    "category": "Work",
    "notes": "Had a productive day",
    "logged_date": "2026-02-05",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="log-mood-for-today-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Mood logged successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can log moods|[Error](#schemaerror)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Conflict - Mood already logged for today|Inline|

<h3 id="log-mood-for-today-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» mood|[MoodEntry](#schemamoodentry)|false|none|none|
|»» id|string(uuid)|false|none|Mood entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who logged the mood|
|»» mood_type|string|false|none|The mood type|
|»» category|string|false|none|Optional category for mood context|
|»» notes|string|false|none|Optional notes about the mood|
|»» logged_date|string(date)|false|none|The date for which this mood is logged|
|»» created_at|string(date-time)|false|none|Timestamp when mood was first logged|
|»» updated_at|string(date-time)|false|none|Timestamp when mood was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

Status Code **409**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|
|» mood_id|string(uuid)|false|none|Existing mood entry ID|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get today's mood

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/mood/today \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/mood/today',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/mood/today`

Retrieve the mood entry for today if it exists

> Example responses

> 200 Response

```json
{
  "message": "Today's mood retrieved successfully",
  "logged": true,
  "mood": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "mood_type": "Happy",
    "category": "Work",
    "notes": "Had a productive day",
    "logged_date": "2026-02-05",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-today's-mood-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Today's mood retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No mood logged for today|Inline|

<h3 id="get-today's-mood-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» logged|boolean|false|none|none|
|» mood|[MoodEntry](#schemamoodentry)|false|none|none|
|»» id|string(uuid)|false|none|Mood entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who logged the mood|
|»» mood_type|string|false|none|The mood type|
|»» category|string|false|none|Optional category for mood context|
|»» notes|string|false|none|Optional notes about the mood|
|»» logged_date|string(date)|false|none|The date for which this mood is logged|
|»» created_at|string(date-time)|false|none|Timestamp when mood was first logged|
|»» updated_at|string(date-time)|false|none|Timestamp when mood was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» logged|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update today's mood

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/mood/today \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "mood_type": "Neutral",
  "category": "Family",
  "notes": "Feeling better after talking with family"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/mood/today',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/mood/today`

Update the mood entry for today. Only available for venter profiles.

> Body parameter

```json
{
  "mood_type": "Neutral",
  "category": "Family",
  "notes": "Feeling better after talking with family"
}
```

<h3 id="update-today's-mood-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» mood_type|body|string|false|The mood type to update|
|» category|body|string|false|Category to update|
|» notes|body|string|false|Notes to update|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» mood_type|Happy|
|» mood_type|Neutral|
|» mood_type|Sad|
|» mood_type|Anxious|
|» mood_type|Mad|
|» category|Work|
|» category|Family|
|» category|Health|
|» category|Unknown|

> Example responses

> 200 Response

```json
{
  "message": "Mood updated successfully",
  "mood": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "mood_type": "Happy",
    "category": "Work",
    "notes": "Had a productive day",
    "logged_date": "2026-02-05",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="update-today's-mood-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Mood updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can update moods|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No mood logged for today to update|[Error](#schemaerror)|

<h3 id="update-today's-mood-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» mood|[MoodEntry](#schemamoodentry)|false|none|none|
|»» id|string(uuid)|false|none|Mood entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who logged the mood|
|»» mood_type|string|false|none|The mood type|
|»» category|string|false|none|Optional category for mood context|
|»» notes|string|false|none|Optional notes about the mood|
|»» logged_date|string(date)|false|none|The date for which this mood is logged|
|»» created_at|string(date-time)|false|none|Timestamp when mood was first logged|
|»» updated_at|string(date-time)|false|none|Timestamp when mood was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get mood history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/mood/history \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/mood/history',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/mood/history`

Retrieve mood history with pagination and optional date filtering

<h3 id="get-mood-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Number of entries to return|
|offset|query|integer|false|Number of entries to skip|
|start_date|query|string(date)|false|Filter moods from this date onwards (YYYY-MM-DD)|
|end_date|query|string(date)|false|Filter moods up to this date (YYYY-MM-DD)|

> Example responses

> 200 Response

```json
{
  "message": "Mood history retrieved successfully",
  "moods": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
      "mood_type": "Happy",
      "category": "Work",
      "notes": "Had a productive day",
      "logged_date": "2026-02-05",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 30,
    "offset": 0,
    "has_more": true
  }
}
```

<h3 id="get-mood-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Mood history retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="get-mood-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» moods|[[MoodEntry](#schemamoodentry)]|false|none|none|
|»» id|string(uuid)|false|none|Mood entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who logged the mood|
|»» mood_type|string|false|none|The mood type|
|»» category|string|false|none|Optional category for mood context|
|»» notes|string|false|none|Optional notes about the mood|
|»» logged_date|string(date)|false|none|The date for which this mood is logged|
|»» created_at|string(date-time)|false|none|Timestamp when mood was first logged|
|»» updated_at|string(date-time)|false|none|Timestamp when mood was last updated|
|» pagination|object|false|none|none|
|»» total|integer|false|none|Total number of mood entries|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» has_more|boolean|false|none|Whether more entries exist|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get mood statistics

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/mood/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/mood/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/mood/stats`

Get mood distribution, trends, and streaks for the logged-in user

<h3 id="get-mood-statistics-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|days|query|integer|false|Number of days to include in statistics|

> Example responses

> 200 Response

```json
{
  "message": "Mood statistics retrieved successfully",
  "period_days": 30,
  "total_entries": 25,
  "mood_distribution": [
    {
      "mood_type": "Happy",
      "count": "10"
    }
  ],
  "category_distribution": [
    {
      "category": "Work",
      "count": "8"
    }
  ],
  "streaks": {
    "current": 5,
    "longest": 12
  }
}
```

<h3 id="get-mood-statistics-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Mood statistics retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="get-mood-statistics-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» period_days|integer|false|none|Number of days included in stats|
|» total_entries|integer|false|none|Total mood entries in period|
|» mood_distribution|[object]|false|none|Distribution of mood types|
|»» mood_type|string|false|none|none|
|»» count|string|false|none|none|
|» category_distribution|[object]|false|none|Distribution of mood categories|
|»» category|string|false|none|none|
|»» count|string|false|none|none|
|» streaks|object|false|none|none|
|»» current|integer|false|none|Current consecutive days streak|
|»» longest|integer|false|none|Longest consecutive days streak|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Delete a mood entry

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/mood/{moodId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/mood/{moodId}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/mood/{moodId}`

Delete a specific mood entry. Users can only delete their own entries. Only available for venter profiles.

<h3 id="delete-a-mood-entry-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|moodId|path|string(uuid)|true|The mood entry ID|

> Example responses

> 200 Response

```json
{
  "message": "Mood deleted successfully",
  "mood_id": "6a3e4e32-a013-41aa-bfa2-724a4eebf557"
}
```

<h3 id="delete-a-mood-entry-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Mood deleted successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can delete moods|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Mood entry not found|[Error](#schemaerror)|

<h3 id="delete-a-mood-entry-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» mood_id|string(uuid)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-reflections">Reflections</h1>

Daily reflection entries linked to moods for venter profiles

## Save or update reflection for today

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/reflections/save \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "reflection_text": "Today I reflected on my goals and felt grateful for the progress I've made. I realize I need to focus more on self-care."
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reflections/save',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/reflections/save`

Save a reflection entry for the current day. Only one reflection per day is allowed. If a reflection already exists for today, it will be updated. Automatically links to today's mood if available. Only available for venter profiles.

> Body parameter

```json
{
  "reflection_text": "Today I reflected on my goals and felt grateful for the progress I've made. I realize I need to focus more on self-care."
}
```

<h3 id="save-or-update-reflection-for-today-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» reflection_text|body|string|true|The text content of the reflection|

> Example responses

> 200 Response

```json
{
  "message": "Reflection updated successfully",
  "reflection": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "mood_log_id": "650e8400-e29b-41d4-a716-446655440001",
    "reflection_text": "Today I reflected on my progress and felt grateful for how far I've come.",
    "reflection_date": "2026-02-10",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="save-or-update-reflection-for-today-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Reflection updated successfully|Inline|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Reflection saved successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - No valid authentication token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can save reflections|[Error](#schemaerror)|

<h3 id="save-or-update-reflection-for-today-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» reflection|[ReflectionEntry](#schemareflectionentry)|false|none|none|
|»» id|string(uuid)|false|none|Reflection entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who created the reflection|
|»» mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|»» reflection_text|string|false|none|The text content of the reflection|
|»» reflection_date|string(date)|false|none|The date for which this reflection is saved|
|»» created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|»» updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» reflection|[ReflectionEntry](#schemareflectionentry)|false|none|none|
|»» id|string(uuid)|false|none|Reflection entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who created the reflection|
|»» mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|»» reflection_text|string|false|none|The text content of the reflection|
|»» reflection_date|string(date)|false|none|The date for which this reflection is saved|
|»» created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|»» updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get today's reflection

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reflections/today \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reflections/today',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reflections/today`

Retrieve the reflection entry for today if it exists, including linked mood information

> Example responses

> 200 Response

```json
{
  "message": "Today's reflection retrieved successfully",
  "saved": true,
  "reflection": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "mood_log_id": "650e8400-e29b-41d4-a716-446655440001",
    "reflection_text": "Today I reflected on my progress and felt grateful for how far I've come.",
    "reflection_date": "2026-02-10",
    "mood_type": "Happy",
    "category": "Work",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-today's-reflection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Today's reflection retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No reflection saved for today|Inline|

<h3 id="get-today's-reflection-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» saved|boolean|false|none|none|
|» reflection|[ReflectionEntryWithMood](#schemareflectionentrywithmood)|false|none|none|
|»» id|string(uuid)|false|none|Reflection entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who created the reflection|
|»» mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|»» reflection_text|string|false|none|The text content of the reflection|
|»» reflection_date|string(date)|false|none|The date for which this reflection is saved|
|»» mood_type|string|false|none|Linked mood type (if available)|
|»» category|string|false|none|Linked mood category (if available)|
|»» created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|»» updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» saved|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get reflection history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reflections/history \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reflections/history',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reflections/history`

Retrieve reflection history with pagination and optional date filtering, including linked mood information

<h3 id="get-reflection-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Number of entries to return|
|offset|query|integer|false|Number of entries to skip|
|start_date|query|string(date)|false|Filter reflections from this date onwards (YYYY-MM-DD)|
|end_date|query|string(date)|false|Filter reflections up to this date (YYYY-MM-DD)|

> Example responses

> 200 Response

```json
{
  "message": "Reflection history retrieved successfully",
  "reflections": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
      "mood_log_id": "650e8400-e29b-41d4-a716-446655440001",
      "reflection_text": "Today I reflected on my progress and felt grateful for how far I've come.",
      "reflection_date": "2026-02-10",
      "mood_type": "Happy",
      "category": "Work",
      "created_at": "2019-08-24T14:15:22Z",
      "updated_at": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 30,
    "offset": 0
  }
}
```

<h3 id="get-reflection-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Reflection history retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="get-reflection-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» reflections|[[ReflectionEntryWithMood](#schemareflectionentrywithmood)]|false|none|none|
|»» id|string(uuid)|false|none|Reflection entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who created the reflection|
|»» mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|»» reflection_text|string|false|none|The text content of the reflection|
|»» reflection_date|string(date)|false|none|The date for which this reflection is saved|
|»» mood_type|string|false|none|Linked mood type (if available)|
|»» category|string|false|none|Linked mood category (if available)|
|»» created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|»» updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|
|» pagination|object|false|none|none|
|»» total|integer|false|none|Total number of reflection entries|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update a specific reflection

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/reflections/{reflectionId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "reflection_text": "Updated reflection: I've been thinking more about my progress and I'm proud of how far I've come."
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reflections/{reflectionId}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/reflections/{reflectionId}`

Update the text content of a specific reflection entry. Users can only update their own reflections. Only available for venter profiles.

> Body parameter

```json
{
  "reflection_text": "Updated reflection: I've been thinking more about my progress and I'm proud of how far I've come."
}
```

<h3 id="update-a-specific-reflection-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|reflectionId|path|string(uuid)|true|The reflection entry ID|
|body|body|object|true|none|
|» reflection_text|body|string|true|The updated text content of the reflection|

> Example responses

> 200 Response

```json
{
  "message": "Reflection updated successfully",
  "reflection": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "mood_log_id": "650e8400-e29b-41d4-a716-446655440001",
    "reflection_text": "Today I reflected on my progress and felt grateful for how far I've come.",
    "reflection_date": "2026-02-10",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="update-a-specific-reflection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Reflection updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can update reflections|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Reflection entry not found|[Error](#schemaerror)|

<h3 id="update-a-specific-reflection-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» reflection|[ReflectionEntry](#schemareflectionentry)|false|none|none|
|»» id|string(uuid)|false|none|Reflection entry unique identifier|
|»» user_id|string(uuid)|false|none|User ID who created the reflection|
|»» mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|»» reflection_text|string|false|none|The text content of the reflection|
|»» reflection_date|string(date)|false|none|The date for which this reflection is saved|
|»» created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|»» updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Delete a reflection entry

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/reflections/{reflectionId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reflections/{reflectionId}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/reflections/{reflectionId}`

Delete a specific reflection entry. Users can only delete their own reflections. Only available for venter profiles.

<h3 id="delete-a-reflection-entry-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|reflectionId|path|string(uuid)|true|The reflection entry ID|

> Example responses

> 200 Response

```json
{
  "message": "Reflection deleted successfully",
  "reflection_id": "57eb8fcd-1cd7-4168-ab2d-56b47823eb7d"
}
```

<h3 id="delete-a-reflection-entry-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Reflection deleted successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can delete reflections|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Reflection entry not found|[Error](#schemaerror)|

<h3 id="delete-a-reflection-entry-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» reflection_id|string(uuid)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-sobriety">Sobriety</h1>

Sobriety streak tracking and event timeline for venters

## Get sobriety status

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sobriety/status \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sobriety/status',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sobriety/status`

Get current sobriety tracking status, days sober, and achieved milestones for the authenticated venter.

> Example responses

> 200 Response

```json
{
  "message": "string",
  "tracking_enabled": true,
  "status": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "sober_start_date": "2026-02-01",
    "last_relapse_date": "2026-01-31",
    "notes": "string",
    "days_sober": 14,
    "achievements": [
      {
        "code": "milestone_14",
        "label": "14 Days",
        "days_required": 14,
        "achieved": true
      }
    ],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-sobriety-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sobriety status retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can access|[Error](#schemaerror)|

<h3 id="get-sobriety-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» tracking_enabled|boolean|false|none|none|
|» status|[SobrietyStatus](#schemasobrietystatus)|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» user_id|string(uuid)|false|none|none|
|»» sober_start_date|string(date)|false|none|none|
|»» last_relapse_date|string(date)¦null|false|none|none|
|»» notes|string¦null|false|none|none|
|»» days_sober|integer|false|none|none|
|»» achievements|[[SobrietyAchievement](#schemasobrietyachievement)]|false|none|none|
|»»» code|string|false|none|none|
|»»» label|string|false|none|none|
|»»» days_required|integer|false|none|none|
|»»» achieved|boolean|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» updated_at|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Start or update sobriety tracking

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/sobriety/start \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "sober_start_date": "2026-02-01",
  "notes": "Starting fresh today"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sobriety/start',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/sobriety/start`

Creates or updates sobriety profile with a streak start date and optional notes.

> Body parameter

```json
{
  "sober_start_date": "2026-02-01",
  "notes": "Starting fresh today"
}
```

<h3 id="start-or-update-sobriety-tracking-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» sober_start_date|body|string(date)|false|none|
|» notes|body|string|false|none|

> Example responses

> 201 Response

```json
{
  "message": "string",
  "status": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "sober_start_date": "2026-02-01",
    "last_relapse_date": "2026-01-31",
    "notes": "string",
    "days_sober": 14,
    "achievements": [
      {
        "code": "milestone_14",
        "label": "14 Days",
        "days_required": 14,
        "achieved": true
      }
    ],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="start-or-update-sobriety-tracking-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Sobriety tracking updated successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can access|[Error](#schemaerror)|

<h3 id="start-or-update-sobriety-tracking-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» status|[SobrietyStatus](#schemasobrietystatus)|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» user_id|string(uuid)|false|none|none|
|»» sober_start_date|string(date)|false|none|none|
|»» last_relapse_date|string(date)¦null|false|none|none|
|»» notes|string¦null|false|none|none|
|»» days_sober|integer|false|none|none|
|»» achievements|[[SobrietyAchievement](#schemasobrietyachievement)]|false|none|none|
|»»» code|string|false|none|none|
|»»» label|string|false|none|none|
|»»» days_required|integer|false|none|none|
|»»» achieved|boolean|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» updated_at|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Log relapse

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/sobriety/relapse \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "relapse_date": "2026-02-20",
  "restart_date": "2026-02-20",
  "notes": "Tough day, restarting immediately"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sobriety/relapse',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/sobriety/relapse`

Logs a relapse event and resets sober start date to restart_date (or relapse_date when omitted).

> Body parameter

```json
{
  "relapse_date": "2026-02-20",
  "restart_date": "2026-02-20",
  "notes": "Tough day, restarting immediately"
}
```

<h3 id="log-relapse-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» relapse_date|body|string(date)|false|none|
|» restart_date|body|string(date)|false|none|
|» notes|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "status": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
    "sober_start_date": "2026-02-01",
    "last_relapse_date": "2026-01-31",
    "notes": "string",
    "days_sober": 14,
    "achievements": [
      {
        "code": "milestone_14",
        "label": "14 Days",
        "days_required": 14,
        "achieved": true
      }
    ],
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="log-relapse-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Relapse logged and sobriety streak reset successfully|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Sobriety tracking not configured|[Error](#schemaerror)|

<h3 id="log-relapse-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» status|[SobrietyStatus](#schemasobrietystatus)|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» user_id|string(uuid)|false|none|none|
|»» sober_start_date|string(date)|false|none|none|
|»» last_relapse_date|string(date)¦null|false|none|none|
|»» notes|string¦null|false|none|none|
|»» days_sober|integer|false|none|none|
|»» achievements|[[SobrietyAchievement](#schemasobrietyachievement)]|false|none|none|
|»»» code|string|false|none|none|
|»»» label|string|false|none|none|
|»»» days_required|integer|false|none|none|
|»»» achieved|boolean|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» updated_at|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get sobriety history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sobriety/history \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sobriety/history',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sobriety/history`

Get sobriety events timeline for the authenticated venter.

<h3 id="get-sobriety-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|none|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "events": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
      "event_type": "relapse",
      "event_date": "2026-02-20",
      "restart_date": "2026-02-20",
      "notes": "string",
      "created_at": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 0,
    "offset": 0,
    "has_more": true
  }
}
```

<h3 id="get-sobriety-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sobriety history retrieved successfully|Inline|

<h3 id="get-sobriety-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» events|[[SobrietyEvent](#schemasobrietyevent)]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» user_id|string(uuid)|false|none|none|
|»» event_type|string|false|none|none|
|»» event_date|string(date)|false|none|none|
|»» restart_date|string(date)¦null|false|none|none|
|»» notes|string¦null|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» has_more|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|event_type|start|
|event_type|relapse|
|event_type|adjustment|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-home">Home</h1>

Venter home summary endpoints for progress, achievements, and recent entries

## Get venter home summary

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/home/summary \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/home/summary',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/home/summary`

Returns progress, highlights, achievements, and merged recent entries (mood + reflections) for the venter home screen.

<h3 id="get-venter-home-summary-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Maximum number of recent entries to return|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "progress": {
    "tracking_enabled": true,
    "days_sober": 0,
    "sober_start_date": "2019-08-24",
    "last_relapse_date": "2019-08-24"
  },
  "highlights": {
    "feeling": "string",
    "latest_mood_date": "2019-08-24",
    "achievements_count": 0
  },
  "achievements": [
    {
      "code": "milestone_14",
      "label": "14 Days",
      "days_required": 14,
      "achieved": true
    }
  ],
  "recent_entries": [
    {
      "id": "string",
      "entry_type": "mood",
      "entry_date": "2019-08-24",
      "created_at": "2019-08-24T14:15:22Z",
      "title": "Happy",
      "content": "string",
      "category": "string",
      "mood_type": "string",
      "mood_log_id": "542514ce-2587-446c-839b-55ba3d58cbaa"
    }
  ]
}
```

<h3 id="get-venter-home-summary-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Venter home summary retrieved successfully|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only venter profiles can access|[Error](#schemaerror)|

<h3 id="get-venter-home-summary-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» progress|object|false|none|none|
|»» tracking_enabled|boolean|false|none|none|
|»» days_sober|integer|false|none|none|
|»» sober_start_date|string(date)¦null|false|none|none|
|»» last_relapse_date|string(date)¦null|false|none|none|
|» highlights|object|false|none|none|
|»» feeling|string¦null|false|none|none|
|»» latest_mood_date|string(date)¦null|false|none|none|
|»» achievements_count|integer|false|none|none|
|» achievements|[[SobrietyAchievement](#schemasobrietyachievement)]|false|none|none|
|»» code|string|false|none|none|
|»» label|string|false|none|none|
|»» days_required|integer|false|none|none|
|»» achieved|boolean|false|none|none|
|» recent_entries|[[HomeRecentEntry](#schemahomerecententry)]|false|none|none|
|»» id|string|false|none|none|
|»» entry_type|string|false|none|none|
|»» entry_date|string(date)|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» title|string|false|none|none|
|»» content|string¦null|false|none|none|
|»» category|string¦null|false|none|none|
|»» mood_type|string¦null|false|none|none|
|»» mood_log_id|string(uuid)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|entry_type|mood|
|entry_type|reflection|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-availability">Availability</h1>

Listener availability and presence management

## Go online as listener

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/availability/online \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/online',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/availability/online`

Mark listener as available to receive chat/call requests. Creates or updates listener profile.

> Example responses

> 200 Response

```json
{
  "message": "You are now online",
  "profile": {
    "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
    "ratePerMinute": 0.5,
    "totalSessions": 42,
    "averageRating": 4.5,
    "bioAnonymous": "I'm here to listen and support you",
    "specialties": [
      "anxiety",
      "relationships",
      "stress"
    ]
  }
}
```

<h3 id="go-online-as-listener-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successfully went online|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listeners can go online|[Error](#schemaerror)|

<h3 id="go-online-as-listener-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» profile|[ListenerProfile](#schemalistenerprofile)|false|none|none|
|»» listenerId|string(uuid)|false|none|Listener user ID|
|»» ratePerMinute|number(float)|false|none|Rate in USD per minute|
|»» totalSessions|integer|false|none|Total completed sessions|
|»» averageRating|number(float)|false|none|Average rating from 1-5|
|»» bioAnonymous|string|false|none|Anonymous bio (no identifying info)|
|»» specialties|[string]|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Go offline as listener

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/availability/offline \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/offline',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/availability/offline`

Mark listener as unavailable and remove from available listeners list.

> Example responses

> 200 Response

```json
{
  "message": "You are now offline"
}
```

<h3 id="go-offline-as-listener-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successfully went offline|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listeners can go offline|[Error](#schemaerror)|

<h3 id="go-offline-as-listener-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Send presence heartbeat

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/availability/heartbeat \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/heartbeat',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/availability/heartbeat`

Updates listener's last seen timestamp. Should be sent every 30 seconds.

> Example responses

> 200 Response

```json
{
  "message": "Heartbeat updated",
  "lastSeen": "2019-08-24T14:15:22Z"
}
```

<h3 id="send-presence-heartbeat-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Heartbeat received|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listeners can send heartbeats|[Error](#schemaerror)|

<h3 id="send-presence-heartbeat-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» lastSeen|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get available listeners

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/availability/listeners \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/listeners',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/availability/listeners`

Get list of online listeners who are not currently busy. Returns anonymous profiles only.

> Example responses

> 200 Response

```json
{
  "listeners": [
    {
      "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
      "ratePerMinute": 0.5,
      "totalSessions": 42,
      "averageRating": 4.5,
      "bioAnonymous": "I'm here to listen and support you",
      "specialties": [
        "anxiety",
        "relationships",
        "stress"
      ]
    }
  ],
  "total": 5
}
```

<h3 id="get-available-listeners-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of available listeners|Inline|

<h3 id="get-available-listeners-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» listeners|[[ListenerProfile](#schemalistenerprofile)]|false|none|none|
|»» listenerId|string(uuid)|false|none|Listener user ID|
|»» ratePerMinute|number(float)|false|none|Rate in USD per minute|
|»» totalSessions|integer|false|none|Total completed sessions|
|»» averageRating|number(float)|false|none|Average rating from 1-5|
|»» bioAnonymous|string|false|none|Anonymous bio (no identifying info)|
|»» specialties|[string]|false|none|none|
|» total|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update listener rate

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/availability/rate \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "ratePerMinute": 0.75
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/rate',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/availability/rate`

Update per-minute rate for chat/call sessions. Must be between $0 and $10.

> Body parameter

```json
{
  "ratePerMinute": 0.75
}
```

<h3 id="update-listener-rate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» ratePerMinute|body|number(float)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Rate updated successfully",
  "profile": {
    "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
    "ratePerMinute": 0.5,
    "totalSessions": 42,
    "averageRating": 4.5,
    "bioAnonymous": "I'm here to listen and support you",
    "specialties": [
      "anxiety",
      "relationships",
      "stress"
    ]
  }
}
```

<h3 id="update-listener-rate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Rate updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid rate|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listeners can update rate|[Error](#schemaerror)|

<h3 id="update-listener-rate-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» profile|[ListenerProfile](#schemalistenerprofile)|false|none|none|
|»» listenerId|string(uuid)|false|none|Listener user ID|
|»» ratePerMinute|number(float)|false|none|Rate in USD per minute|
|»» totalSessions|integer|false|none|Total completed sessions|
|»» averageRating|number(float)|false|none|Average rating from 1-5|
|»» bioAnonymous|string|false|none|Anonymous bio (no identifying info)|
|»» specialties|[string]|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get current availability status

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/availability/status \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/status',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/availability/status`

Get listener's current online/offline/busy status.

> Example responses

> 200 Response

```json
{
  "status": "online",
  "isBusy": false,
  "lastSeen": "2019-08-24T14:15:22Z"
}
```

<h3 id="get-current-availability-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Current availability status|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listeners can check status|[Error](#schemaerror)|

<h3 id="get-current-availability-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» isBusy|boolean|false|none|none|
|» lastSeen|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|online|
|status|offline|
|status|busy|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get listener profile

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/availability/profile \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/availability/profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/availability/profile`

Get listener's complete profile including rate, ratings, and stats.

> Example responses

> 200 Response

```json
{
  "profile": {
    "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
    "ratePerMinute": 0.5,
    "totalSessions": 42,
    "averageRating": 4.5,
    "bioAnonymous": "I'm here to listen and support you",
    "specialties": [
      "anxiety",
      "relationships",
      "stress"
    ]
  }
}
```

<h3 id="get-listener-profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Listener profile|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listeners can view profile|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Profile not found|[Error](#schemaerror)|

<h3 id="get-listener-profile-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» profile|[ListenerProfile](#schemalistenerprofile)|false|none|none|
|»» listenerId|string(uuid)|false|none|Listener user ID|
|»» ratePerMinute|number(float)|false|none|Rate in USD per minute|
|»» totalSessions|integer|false|none|Total completed sessions|
|»» averageRating|number(float)|false|none|Average rating from 1-5|
|»» bioAnonymous|string|false|none|Anonymous bio (no identifying info)|
|»» specialties|[string]|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-chat">Chat</h1>

Anonymous text chat between venters and listeners

## Create chat conversation

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/conversations \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/conversations`

Venter requests a text chat with an available listener. Requires sufficient wallet balance.

> Body parameter

```json
{
  "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70"
}
```

<h3 id="create-chat-conversation-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» listenerId|body|string(uuid)|true|Listener's user ID|

> Example responses

> 201 Response

```json
{
  "message": "Chat request sent",
  "conversation": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "pending",
    "otherParticipant": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    },
    "ratePerMinute": 0.5,
    "durationMinutes": 15,
    "totalCost": 7.5,
    "createdAt": "2019-08-24T14:15:22Z",
    "startedAt": "2019-08-24T14:15:22Z",
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="create-chat-conversation-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Conversation created, waiting for listener acceptance|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error or listener unavailable|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only venters can create conversations|[Error](#schemaerror)|

<h3 id="create-chat-conversation-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» conversation|[Conversation](#schemaconversation)|false|none|none|
|»» id|string(uuid)|false|none|Conversation ID|
|»» status|string|false|none|Conversation status|
|»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»» ratePerMinute|number(float)|false|none|none|
|»» durationMinutes|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|ended|
|status|declined|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get conversation history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/conversations \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/conversations`

Get list of all conversations for current user (venter or listener).

<h3 id="get-conversation-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|status|query|string|false|Filter by status|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|active|
|status|ended|
|status|declined|

> Example responses

> 200 Response

```json
{
  "conversations": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "status": "pending",
      "otherParticipant": {
        "anonymousName": "Swift Fox",
        "avatarSeed": "a1b2c3d4e5f6"
      },
      "ratePerMinute": 0.5,
      "durationMinutes": 15,
      "totalCost": 7.5,
      "createdAt": "2019-08-24T14:15:22Z",
      "startedAt": "2019-08-24T14:15:22Z",
      "endedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 10
}
```

<h3 id="get-conversation-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of conversations|Inline|

<h3 id="get-conversation-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» conversations|[[Conversation](#schemaconversation)]|false|none|none|
|»» id|string(uuid)|false|none|Conversation ID|
|»» status|string|false|none|Conversation status|
|»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»» ratePerMinute|number(float)|false|none|none|
|»» durationMinutes|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|
|» total|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|ended|
|status|declined|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get conversation details

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/conversations/{conversationId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations/{conversationId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/conversations/{conversationId}`

Get details of a specific conversation including anonymous identities.

<h3 id="get-conversation-details-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|conversationId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "conversation": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "pending",
    "otherParticipant": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    },
    "ratePerMinute": 0.5,
    "durationMinutes": 15,
    "totalCost": 7.5,
    "createdAt": "2019-08-24T14:15:22Z",
    "startedAt": "2019-08-24T14:15:22Z",
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-conversation-details-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Conversation details|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not a participant in this conversation|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Conversation not found|[Error](#schemaerror)|

<h3 id="get-conversation-details-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» conversation|[Conversation](#schemaconversation)|false|none|none|
|»» id|string(uuid)|false|none|Conversation ID|
|»» status|string|false|none|Conversation status|
|»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»» ratePerMinute|number(float)|false|none|none|
|»» durationMinutes|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|ended|
|status|declined|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Accept chat request

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/conversations/{conversationId}/accept \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations/{conversationId}/accept',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/conversations/{conversationId}/accept`

Listener accepts pending chat request. Marks conversation as active.

<h3 id="accept-chat-request-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|conversationId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Chat accepted",
  "conversation": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "pending",
    "otherParticipant": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    },
    "ratePerMinute": 0.5,
    "durationMinutes": 15,
    "totalCost": 7.5,
    "createdAt": "2019-08-24T14:15:22Z",
    "startedAt": "2019-08-24T14:15:22Z",
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="accept-chat-request-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Chat request accepted|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only assigned listener can accept|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Conversation not found|[Error](#schemaerror)|

<h3 id="accept-chat-request-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» conversation|[Conversation](#schemaconversation)|false|none|none|
|»» id|string(uuid)|false|none|Conversation ID|
|»» status|string|false|none|Conversation status|
|»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»» ratePerMinute|number(float)|false|none|none|
|»» durationMinutes|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|ended|
|status|declined|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Decline chat request

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/conversations/{conversationId}/decline \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations/{conversationId}/decline',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/conversations/{conversationId}/decline`

Listener declines pending chat request.

<h3 id="decline-chat-request-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|conversationId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Chat declined"
}
```

<h3 id="decline-chat-request-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Chat request declined|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only assigned listener can decline|[Error](#schemaerror)|

<h3 id="decline-chat-request-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## End conversation

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/conversations/{conversationId}/end \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations/{conversationId}/end',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/conversations/{conversationId}/end`

End active conversation. Calculates duration, deducts from wallet, creates earnings for listener.

<h3 id="end-conversation-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|conversationId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Conversation ended",
  "durationMinutes": 15,
  "totalCost": 7.5,
  "earnings": 6
}
```

<h3 id="end-conversation-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Conversation ended successfully|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not a participant in this conversation|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Conversation not found|[Error](#schemaerror)|

<h3 id="end-conversation-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» durationMinutes|integer|false|none|none|
|» totalCost|number(float)|false|none|none|
|» earnings|number(float)|false|none|Only sent to listener|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get conversation messages

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/conversations/{conversationId}/messages \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/conversations/{conversationId}/messages',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/conversations/{conversationId}/messages`

Get paginated messages for a conversation with anonymous sender identities.

<h3 id="get-conversation-messages-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|conversationId|path|string(uuid)|true|none|
|limit|query|integer|false|Number of messages to return (default: 50)|
|before|query|string(uuid)|false|Message ID to fetch messages before (for pagination)|

> Example responses

> 200 Response

```json
{
  "messages": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "content": "Hello, how can I help?",
      "sender": {
        "anonymousName": "Swift Fox",
        "avatarSeed": "a1b2c3d4e5f6",
        "isMe": true
      },
      "deliveredAt": "2019-08-24T14:15:22Z",
      "readAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "total": 42,
  "hasMore": true
}
```

<h3 id="get-conversation-messages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of messages|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not a participant in this conversation|[Error](#schemaerror)|

<h3 id="get-conversation-messages-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» messages|[[Message](#schemamessage)]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» content|string|false|none|none|
|»» sender|any|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|none|
|»»»» isMe|boolean|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» deliveredAt|string(date-time)|false|none|none|
|»» readAt|string(date-time)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|» total|integer|false|none|none|
|» hasMore|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-calls">Calls</h1>

Anonymous voice calls via Twilio Programmable Voice

## Create voice call request

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/calls \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "listenerId": "550e8400-e29b-41d4-a716-446655440000"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/calls`

Venter creates a voice call request with an available listener. Requires either an active subscription OR sufficient wallet balance (minimum 5 minutes for prepaid users). Notifies the listener via Socket.io personal user room (userId as string) and triggers FCM push notification fallback for registered devices. Subscribers can make calls using their included minutes or overage.

> Body parameter

```json
{
  "listenerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

<h3 id="create-voice-call-request-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» listenerId|body|string(uuid)|true|Listener's user ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "call": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "status": "requesting",
    "listener": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    },
    "ratePerMinute": 0.5,
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="create-voice-call-request-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Call request created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error or listener unavailable|[Error](#schemaerror)|
|402|[Payment Required](https://tools.ietf.org/html/rfc7231#section-6.5.2)|Insufficient balance or no payment method|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Listener not found|[Error](#schemaerror)|

<h3 id="create-voice-call-request-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» call|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» listener|object|false|none|none|
|»»» anonymousName|string|false|none|none|
|»»» avatarSeed|string|false|none|none|
|»» ratePerMinute|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|

Status Code **402**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|
|» balance|number|false|none|Current balance in minutes (prepaid users only)|
|» required|number|false|none|Minimum minutes required|
|» suggestion|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get active call

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/calls/active \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/active',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/calls/active`

Get currently active or pending call for user (if any). Includes requesting, ringing, or active calls.

> Example responses

> 200 Response

```json
{
  "success": true,
  "activeCall": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "requesting",
    "otherParticipant": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    },
    "roomName": "string",
    "ratePerMinute": 0.1,
    "createdAt": "2019-08-24T14:15:22Z",
    "startedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-active-call-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Active call details or null if no active call|Inline|

<h3 id="get-active-call-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» activeCall|any|false|none|none|

*oneOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» id|string(uuid)|false|none|none|
|»»» status|string|false|none|none|
|»»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»»» roomName|string|false|none|Twilio room name (if accepted)|
|»»» ratePerMinute|number(float)|false|none|none|
|»»» createdAt|string(date-time)|false|none|none|
|»»» startedAt|string(date-time)|false|none|none|

*xor*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|requesting|
|status|ringing|
|status|active|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get call history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/calls/history \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/history',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/calls/history`

Get list of ended voice calls for current user with pagination. Only returns calls with status 'ended'.

<h3 id="get-call-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Number of calls to return|
|offset|query|integer|false|Number of calls to skip|

> Example responses

> 200 Response

```json
{
  "success": true,
  "count": 8,
  "calls": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "status": "ended",
      "otherParticipant": {
        "anonymousName": "Swift Fox",
        "avatarSeed": "a1b2c3d4e5f6"
      },
      "ratePerMinute": 0.1,
      "durationSeconds": 0,
      "durationMinutes": 0,
      "totalCost": 0.1,
      "createdAt": "2019-08-24T14:15:22Z",
      "startedAt": "2019-08-24T14:15:22Z",
      "endedAt": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="get-call-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of voice calls|Inline|

<h3 id="get-call-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» count|integer|false|none|none|
|» calls|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»» ratePerMinute|number(float)|false|none|none|
|»» durationSeconds|integer|false|none|none|
|»» durationMinutes|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get call details

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/calls/{callId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/{callId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/calls/{callId}`

Get details of a specific voice call. Only accessible by participants.

<h3 id="get-call-details-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|callId|path|string(uuid)|true|The call ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "call": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "requesting",
    "otherParticipant": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    },
    "roomName": "string",
    "ratePerMinute": 0.1,
    "durationSeconds": 0,
    "totalCost": 0.1,
    "createdAt": "2019-08-24T14:15:22Z",
    "startedAt": "2019-08-24T14:15:22Z",
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-call-details-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Call details|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not a participant in this call|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|[Error](#schemaerror)|

<h3 id="get-call-details-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» call|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|
|»» roomName|string|false|none|Twilio room name|
|»» ratePerMinute|number(float)|false|none|none|
|»» durationSeconds|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|requesting|
|status|ringing|
|status|active|
|status|ended|
|status|declined|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Accept call request (listener only)

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/calls/{callId}/accept \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/{callId}/accept',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/calls/{callId}/accept`

Listener accepts pending call request. Creates Twilio room, generates tokens for both participants, and notifies venter via Socket.io personal user room (userId as string).

<h3 id="accept-call-request-(listener-only)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|callId|path|string(uuid)|true|The call ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "call": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "ringing",
    "roomName": "string",
    "token": "string",
    "venter": {
      "anonymousName": "Swift Fox",
      "avatarSeed": "a1b2c3d4e5f6"
    }
  }
}
```

<h3 id="accept-call-request-(listener-only)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Call accepted successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid call status|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only assigned listener can accept|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|[Error](#schemaerror)|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Twilio service unavailable|[Error](#schemaerror)|

<h3 id="accept-call-request-(listener-only)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» call|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» roomName|string|false|none|Twilio room name|
|»» token|string|false|none|Twilio access token for listener|
|»» venter|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|»»» anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|»»» avatarSeed|string|false|none|Seed for generating consistent avatar on client|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Decline call request (listener only)

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/calls/{callId}/decline \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/{callId}/decline',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/calls/{callId}/decline`

Listener declines pending call request. Notifies venter via Socket.io personal user room (userId as string).

<h3 id="decline-call-request-(listener-only)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|callId|path|string(uuid)|true|The call ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Call declined"
}
```

<h3 id="decline-call-request-(listener-only)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Call request declined|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid call status|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only assigned listener can decline|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|[Error](#schemaerror)|

<h3 id="decline-call-request-(listener-only)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## End voice call

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/calls/{callId}/end \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/{callId}/end',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/calls/{callId}/end`

End active or ringing call. Calculates duration and cost, deducts from venter wallet, creates listener earnings, and notifies both participants via their Socket.io personal user rooms (userId as string).

<h3 id="end-voice-call-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|callId|path|string(uuid)|true|The call ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "call": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "ended",
    "durationSeconds": 900,
    "durationMinutes": 15,
    "totalCost": 7.5,
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="end-voice-call-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Call ended successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid call status|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not a participant in this call|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|[Error](#schemaerror)|

<h3 id="end-voice-call-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» call|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» durationSeconds|integer|false|none|none|
|»» durationMinutes|integer|false|none|none|
|»» totalCost|number(float)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get Twilio access token

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/calls/{callId}/token \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/{callId}/token',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/calls/{callId}/token`

Get Twilio access token for joining an accepted call. Call must be in 'ringing' or 'active' status.

<h3 id="get-twilio-access-token-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|callId|path|string(uuid)|true|The call ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "token": "string",
  "roomName": "string"
}
```

<h3 id="get-twilio-access-token-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Twilio access token|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Room not ready - call not yet accepted|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not a participant in this call|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|[Error](#schemaerror)|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Twilio service unavailable|[Error](#schemaerror)|

<h3 id="get-twilio-access-token-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» token|string|false|none|Twilio access token JWT|
|» roomName|string|false|none|Twilio room name|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Twilio voice webhook

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/calls/voice \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Accept: text/xml'

```

```javascript
const inputBody = '{
  "To": "string",
  "From": "string",
  "CallSid": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'text/xml'
};

fetch('{protocol}://{host}:{port}/api/v1/calls/voice',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/calls/voice`

Webhook endpoint called by Twilio when a call is initiated from the mobile app. Returns TwiML response for call routing. No authentication required - Twilio validates the request.

> Body parameter

```yaml
To: string
From: string
CallSid: string

```

<h3 id="twilio-voice-webhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» To|body|string|false|Call ID or session ID|
|» From|body|string|false|Caller phone number or client identity|
|» CallSid|body|string|false|Twilio call SID|

> Example responses

> 200 Response

<h3 id="twilio-voice-webhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TwiML response|string|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ventally-api-crisis">Crisis</h1>

Crisis escalation events for chat/call sessions and safety analytics

## Escalate a call to crisis status

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/crisis/escalate \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "voiceCallId": "6cf75110-07e2-4bd9-8543-4e0958c4772a",
  "riskCategory": "self_harm",
  "notes": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/crisis/escalate',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/crisis/escalate`

Listener-only endpoint to escalate an active call for crisis intervention.

> Body parameter

```json
{
  "voiceCallId": "6cf75110-07e2-4bd9-8543-4e0958c4772a",
  "riskCategory": "self_harm",
  "notes": "string"
}
```

<h3 id="escalate-a-call-to-crisis-status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» voiceCallId|body|string(uuid)|true|Voice call ID to escalate|
|» riskCategory|body|string|true|none|
|» notes|body|string|false|Optional escalation notes|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» riskCategory|self_harm|
|» riskCategory|suicide|
|» riskCategory|harm_to_others|
|» riskCategory|severe_distress|
|» riskCategory|other|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Call escalated to crisis status",
  "crisisEvent": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "riskCategory": "string",
    "escalatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="escalate-a-call-to-crisis-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Call escalated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listener can escalate|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Already escalated|None|

<h3 id="escalate-a-call-to-crisis-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» crisisEvent|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» riskCategory|string|false|none|none|
|»» escalatedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Record crisis-help escalation event for chat/call session

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/crisis/escalation-event \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "sessionType": "call",
  "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
  "riskCategory": "self_harm",
  "notes": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/crisis/escalation-event',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/crisis/escalation-event`

Listener-only endpoint to record that crisis help was escalated for a referenced call or chat session.

> Body parameter

```json
{
  "sessionType": "call",
  "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
  "riskCategory": "self_harm",
  "notes": "string"
}
```

<h3 id="record-crisis-help-escalation-event-for-chat/call-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» sessionType|body|string|true|Session channel where escalation occurred|
|» sessionId|body|string(uuid)|true|Referenced voice call or conversation ID|
|» riskCategory|body|string|true|none|
|» notes|body|string|false|Optional notes used in reporting context|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» sessionType|call|
|» sessionType|chat|
|» riskCategory|self_harm|
|» riskCategory|suicide|
|» riskCategory|harm_to_others|
|» riskCategory|severe_distress|
|» riskCategory|other|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "Crisis help escalation recorded",
  "crisisEvent": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "sessionType": "call",
    "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
    "riskCategory": "string",
    "actionTaken": "help_escalated",
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="record-crisis-help-escalation-event-for-chat/call-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Crisis escalation event recorded|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listener can record event|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Session not found|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Escalation already recorded|None|

<h3 id="record-crisis-help-escalation-event-for-chat/call-session-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» crisisEvent|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» sessionType|string|false|none|none|
|»» sessionId|string(uuid)|false|none|none|
|»» riskCategory|string|false|none|none|
|»» actionTaken|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Transfer escalated call to 988

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/crisis/handoff-988 \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "voiceCallId": "6cf75110-07e2-4bd9-8543-4e0958c4772a",
  "reason": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/crisis/handoff-988',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/crisis/handoff-988`

Listener-only endpoint to initiate 988 handoff after call escalation.

> Body parameter

```json
{
  "voiceCallId": "6cf75110-07e2-4bd9-8543-4e0958c4772a",
  "reason": "string"
}
```

<h3 id="transfer-escalated-call-to-988-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» voiceCallId|body|string(uuid)|true|Voice call ID|
|» reason|body|string|false|Optional handoff reason|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "Call transfer to 988 initiated",
  "handoff": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "handoffAt": "2019-08-24T14:15:22Z",
    "crisis988Number": "988"
  }
}
```

<h3 id="transfer-escalated-call-to-988-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|988 handoff initiated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error / not escalated|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only listener can initiate handoff|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Already transferred|None|

<h3 id="transfer-escalated-call-to-988-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» handoff|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» handoffAt|string(date-time)|false|none|none|
|»» crisis988Number|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get crisis events for call

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/crisis/events/{voiceCallId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/crisis/events/{voiceCallId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/crisis/events/{voiceCallId}`

Get crisis events for a voice call. Accessible by call participants and admin/sub-admin.

<h3 id="get-crisis-events-for-call-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|voiceCallId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "voiceCallId": "6cf75110-07e2-4bd9-8543-4e0958c4772a",
  "events": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "session_type": "call",
      "session_id": "1ffd059c-17ea-40a8-8aef-70fd0307db82",
      "risk_category": "string",
      "action_taken": "string",
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="get-crisis-events-for-call-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Crisis events|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorized|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Call not found|None|

<h3 id="get-crisis-events-for-call-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» voiceCallId|string(uuid)|false|none|none|
|» events|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» session_type|string|false|none|none|
|»» session_id|string(uuid)|false|none|none|
|»» risk_category|string|false|none|none|
|»» action_taken|string|false|none|none|
|»» created_at|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|session_type|call|
|session_type|chat|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get crisis analytics statistics

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/crisis/admin/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/crisis/admin/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/crisis/admin/stats`

Admin/sub-admin endpoint to analyze crisis events across call and chat sessions.

<h3 id="get-crisis-analytics-statistics-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|from|query|string(date-time)|false|Inclusive lower bound for created_at filter|
|to|query|string(date-time)|false|Inclusive upper bound for created_at filter|
|sessionType|query|string|false|none|
|actionTaken|query|string|false|none|
|riskCategory|query|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|riskCategory|self_harm|
|riskCategory|suicide|
|riskCategory|harm_to_others|
|riskCategory|severe_distress|
|riskCategory|other|

> Example responses

> 200 Response

```json
{
  "success": true,
  "filters": {},
  "stats": {
    "totals": {
      "total_events": 7,
      "total_sessions": 6,
      "impacted_users": 6,
      "triggering_listeners": 4
    },
    "bySessionType": [
      {
        "session_type": "string",
        "count": 0
      }
    ],
    "byRiskCategory": [
      {
        "risk_category": "string",
        "count": 0
      }
    ],
    "byActionTaken": [
      {
        "action_taken": "string",
        "count": 0
      }
    ],
    "daily": [
      {
        "date": "2019-08-24",
        "count": 0
      }
    ]
  }
}
```

<h3 id="get-crisis-analytics-statistics-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Crisis analytics|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Admin access required|None|

<h3 id="get-crisis-analytics-statistics-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» filters|object|false|none|none|
|» stats|object|false|none|none|
|»» totals|object|false|none|none|
|»»» total_events|integer|false|none|none|
|»»» total_sessions|integer|false|none|none|
|»»» impacted_users|integer|false|none|none|
|»»» triggering_listeners|integer|false|none|none|
|»» bySessionType|[object]|false|none|none|
|»»» session_type|string|false|none|none|
|»»» count|integer|false|none|none|
|»» byRiskCategory|[object]|false|none|none|
|»»» risk_category|string|false|none|none|
|»»» count|integer|false|none|none|
|»» byActionTaken|[object]|false|none|none|
|»»» action_taken|string|false|none|none|
|»»» count|integer|false|none|none|
|»» daily|[object]|false|none|none|
|»»» date|string(date)|false|none|none|
|»»» count|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-earnings">Earnings</h1>

Listener earnings and payout management

## Create listener bank-account onboarding link

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/earnings/bank-account/link \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "platform": "ios"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/earnings/bank-account/link',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/earnings/bank-account/link`

Create or reuse a Stripe Connect account and return an onboarding URL for listener bank-account setup. returnUrl/refreshUrl are optional overrides; backend defaults are used for mobile webview flow.

> Body parameter

```json
{
  "platform": "ios"
}
```

<h3 id="create-listener-bank-account-onboarding-link-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» platform|body|string|false|none|
|» returnUrl|body|string|false|Optional override. If omitted, backend default callback URL is used.|
|» refreshUrl|body|string|false|Optional override. If omitted, backend default callback URL is used.|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» platform|ios|
|» platform|android|
|» platform|web|

> Example responses

> 200 Response

```json
{
  "success": true,
  "bankLink": {
    "accountId": "acct_1ABCxyz...",
    "onboardingUrl": "https://connect.stripe.com/...",
    "expiresAt": "2026-03-15T10:30:00.000Z",
    "platform": "ios",
    "returnUrl": "https://api.ventally.com/api/billing/cancel?flow=bank_link&result=return",
    "refreshUrl": "https://api.ventally.com/api/billing/cancel?flow=bank_link&result=refresh"
  }
}
```

<h3 id="create-listener-bank-account-onboarding-link-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Bank onboarding link generated|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Listener role required|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Payout service unavailable|[Error](#schemaerror)|

<h3 id="create-listener-bank-account-onboarding-link-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» bankLink|object|false|none|none|
|»» accountId|string|false|none|none|
|»» onboardingUrl|string|false|none|none|
|»» expiresAt|string(date-time)|false|none|none|
|»» platform|string|false|none|none|
|»» returnUrl|string|false|none|none|
|»» refreshUrl|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get listener bank-account status

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/earnings/bank-account/status \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/earnings/bank-account/status',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/earnings/bank-account/status`

Return current payout account readiness for listener bank-account linking status.

> Example responses

> 200 Response

```json
{
  "success": true,
  "status": {
    "stripeAccountStatus": "active",
    "payoutEnabled": true,
    "requirementsDue": [],
    "accountId": "acct_1ABCxyz..."
  }
}
```

<h3 id="get-listener-bank-account-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Bank-account status retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Listener role required|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-listener-bank-account-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» status|object|false|none|none|
|»» stripeAccountStatus|string|false|none|none|
|»» payoutEnabled|boolean|false|none|none|
|»» requirementsDue|[string]|false|none|none|
|»» accountId|string¦null|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Withdraw listener earnings

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/earnings/withdraw \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "amount": 45.25
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/earnings/withdraw',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/earnings/withdraw`

Create an immediate payout transfer for listener earnings. If request body includes amount, that exact amount is withdrawn; otherwise full available balance is withdrawn.

> Body parameter

```json
{
  "amount": 45.25
}
```

<h3 id="withdraw-listener-earnings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|
|» amount|body|number(float)|false|Optional exact amount to withdraw. Must be > 0 and <= available balance.|

> Example responses

> 201 Response

```json
{
  "success": true,
  "payout": {
    "id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "amount": 118.5,
    "requestedAmount": 45.25,
    "processedAmount": 45.25,
    "status": "completed",
    "stripeTransferId": "tr_1234567890abcdef",
    "createdAt": "2026-03-15T09:40:12.000Z",
    "processedAt": "2026-03-15T09:40:13.000Z",
    "earningsCount": 6,
    "allocationCount": 2
  }
}
```

> Forbidden - Listener role or verification required

```json
{
  "error": "Permission denied",
  "message": "Only listeners can request withdrawals"
}
```

```json
{
  "error": "LISTENER_NOT_VERIFIED",
  "message": "Only verified listeners can withdraw earnings"
}
```

> Unprocessable request - payout prerequisites or balance not met

```json
{
  "error": "NO_AVAILABLE_EARNINGS",
  "message": "No available earnings to withdraw"
}
```

```json
{
  "error": "INVALID_WITHDRAWAL_AMOUNT",
  "message": "Withdrawal amount must be a positive number with up to 2 decimals"
}
```

```json
{
  "error": "WITHDRAWAL_AMOUNT_EXCEEDS_AVAILABLE",
  "message": "Requested amount exceeds available earnings",
  "details": {
    "requestedAmount": 200,
    "availableAmount": 118.5
  }
}
```

```json
{
  "error": "WITHDRAWAL_ALLOCATION_FAILED",
  "message": "Unable to allocate requested withdrawal amount"
}
```

```json
{
  "error": "STRIPE_ACCOUNT_NOT_CONNECTED",
  "message": "Connect your Stripe payout account before withdrawing"
}
```

```json
{
  "error": "PAYOUT_NOT_ENABLED",
  "message": "Payouts are not enabled for this listener account",
  "details": {
    "stripeAccountStatus": "incomplete",
    "requirementsDue": [
      "external_account"
    ]
  }
}
```

> 502 Response

```json
{
  "error": "PAYOUT_TRANSFER_FAILED",
  "message": "Payout transfer failed"
}
```

> Payout service unavailable

```json
{
  "error": "PAYOUT_SERVICE_UNAVAILABLE",
  "message": "Payout service is not configured"
}
```

```json
{
  "error": "PAYOUT_SERVICE_UNAVAILABLE",
  "message": "Unable to verify payout account status. Please try again."
}
```

<h3 id="withdraw-listener-earnings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Withdrawal processed successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Listener role or verification required|[Error](#schemaerror)|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Unprocessable request - payout prerequisites or balance not met|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|
|502|[Bad Gateway](https://tools.ietf.org/html/rfc7231#section-6.6.3)|Stripe transfer failed|[Error](#schemaerror)|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|Payout service unavailable|[Error](#schemaerror)|

<h3 id="withdraw-listener-earnings-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» payout|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» amount|number(float)|false|none|none|
|»» requestedAmount|number(float)|false|none|none|
|»» processedAmount|number(float)|false|none|none|
|»» status|string|false|none|none|
|»» stripeTransferId|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» processedAt|string(date-time)|false|none|none|
|»» earningsCount|integer|false|none|none|
|»» allocationCount|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|completed|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get listener earnings summary

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/earnings/summary \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/earnings/summary',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/earnings/summary`

Get overview of listener's earnings including pending, available, and paid balances. Only accessible by listeners.

> Example responses

> 200 Response

```json
{
  "pendingBalance": 45.5,
  "availableBalance": 123.75,
  "totalPaid": 1250,
  "lifetimeEarnings": 1419.25,
  "pendingSessions": 12,
  "totalSessions": 87
}
```

<h3 id="get-listener-earnings-summary-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Earnings summary retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only listeners can access earnings|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-listener-earnings-summary-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» pendingBalance|number(float)|false|none|Earnings not yet available for payout|
|» availableBalance|number(float)|false|none|Earnings available for payout|
|» totalPaid|number(float)|false|none|Total amount already paid out|
|» lifetimeEarnings|number(float)|false|none|Total earnings across all time|
|» pendingSessions|integer|false|none|Number of sessions with pending/available earnings|
|» totalSessions|integer|false|none|Total number of earning sessions|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get listener earnings transactions

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/earnings \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/earnings',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/earnings`

Get detailed list of listener's earnings from individual sessions with pagination and filtering. Only accessible by listeners.

<h3 id="get-listener-earnings-transactions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Number of transactions to return|
|offset|query|integer|false|Number of transactions to skip for pagination|
|status|query|string|false|Filter by earning status|
|sessionType|query|string|false|Filter by session type|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|available|
|status|paid|
|status|cancelled|
|sessionType|call|
|sessionType|chat|

> Example responses

> 200 Response

```json
{
  "earnings": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "sessionType": "call",
      "sessionId": "b2c3d4e5-f6g7-8901-bcde-f12345678901",
      "grossAmount": 15,
      "platformFee": 3,
      "netAmount": 12,
      "paidAmount": 5.5,
      "remainingAmount": 6.5,
      "platformFeePercentage": 0.2,
      "status": "available",
      "payoutId": null,
      "createdAt": "2026-02-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 87,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

<h3 id="get-listener-earnings-transactions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Earnings transactions retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only listeners can access earnings|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-listener-earnings-transactions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» earnings|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» sessionType|string|false|none|none|
|»» sessionId|string(uuid)|false|none|none|
|»» grossAmount|number(float)|false|none|Total session cost before fees|
|»» platformFee|number(float)|false|none|Platform fee deducted|
|»» netAmount|number(float)|false|none|Amount listener receives|
|»» paidAmount|number(float)|false|none|Amount already paid out from this earning|
|»» remainingAmount|number(float)|false|none|Amount still available to withdraw from this earning|
|»» platformFeePercentage|number(float)|false|none|Platform fee percentage (0.20 = 20%)|
|»» status|string|false|none|none|
|»» payoutId|string(uuid)¦null|false|none|ID of payout this earning is included in|
|»» createdAt|string(date-time)|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» hasMore|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|status|pending|
|status|available|
|status|paid|
|status|cancelled|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get listener payout history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/earnings/payouts \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/earnings/payouts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/earnings/payouts`

Get list of all payouts made to the listener with pagination and filtering. Only accessible by listeners.

<h3 id="get-listener-payout-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Number of payouts to return|
|offset|query|integer|false|Number of payouts to skip for pagination|
|status|query|string|false|Filter by payout status|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|processing|
|status|completed|
|status|failed|
|status|cancelled|

> Example responses

> 200 Response

```json
{
  "payouts": [
    {
      "id": "c3d4e5f6-g7h8-9012-cdef-123456789012",
      "amount": 250,
      "stripeTransferId": "tr_1234567890abcdef",
      "status": "completed",
      "failureReason": null,
      "processedAt": "2026-02-10T15:45:00.000Z",
      "createdAt": "2026-02-10T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

<h3 id="get-listener-payout-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Payout history retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - Only listeners can access payouts|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-listener-payout-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» payouts|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» amount|number(float)|false|none|Payout amount|
|»» stripeTransferId|string¦null|false|none|Stripe transfer ID if processed|
|»» status|string|false|none|none|
|»» failureReason|string¦null|false|none|Reason if payout failed|
|»» processedAt|string(date-time)¦null|false|none|When payout was processed|
|»» createdAt|string(date-time)|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» hasMore|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|processing|
|status|completed|
|status|failed|
|status|cancelled|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-reviews">Reviews</h1>

Anonymous session reviews and ratings

## Submit a review

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/reviews \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "sessionType": "call",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "revieweeId": "987e6543-e21b-34d5-a678-426614174111",
  "rating": 5,
  "comment": "Great listener, very helpful!"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reviews',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/reviews`

Submit a rating and optional comment for another user after a call or chat session. Both users must have been participants in the session, which must be ended.

> Body parameter

```json
{
  "sessionType": "call",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "revieweeId": "987e6543-e21b-34d5-a678-426614174111",
  "rating": 5,
  "comment": "Great listener, very helpful!"
}
```

<h3 id="submit-a-review-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» sessionType|body|string|true|none|
|» sessionId|body|string(uuid)|true|none|
|» revieweeId|body|string(uuid)|true|ID of the user being reviewed|
|» rating|body|integer|true|none|
|» comment|body|any|false|Optional comment. Canonical format is string; object with text is accepted for backward compatibility.|
|»» *anonymous*|body|string|false|none|
|»» *anonymous*|body|object|false|none|
|»»» text|body|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» sessionType|call|
|» sessionType|chat|

> Example responses

> 201 Response

```json
{
  "success": true,
  "review": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "sessionType": "call",
    "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
    "reviewerId": "6426b718-0cec-4a62-ba39-47b50ade3870",
    "revieweeId": "6fad12bc-7643-4b0d-8d90-cf8e97d62387",
    "rating": 5,
    "comment": "Great listener, very helpful!",
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="submit-a-review-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Review submitted successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not authorized to review this session|[Error](#schemaerror)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Already reviewed this session|[Error](#schemaerror)|

<h3 id="submit-a-review-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» review|[Review](#schemareview)|false|none|none|
|»» id|string(uuid)|false|none|Review unique identifier|
|»» sessionType|string|false|none|Type of session reviewed|
|»» sessionId|string(uuid)|false|none|Session ID that was reviewed|
|»» reviewerId|string(uuid)|false|none|ID of user who submitted the review|
|»» revieweeId|string(uuid)|false|none|ID of user who received the review|
|»» rating|integer|false|none|Rating from 1 to 5 stars|
|»» comment|string|false|none|Optional review comment|
|»» createdAt|string(date-time)|false|none|Review submission timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get user reviews

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reviews/{userId} \
  -H 'Accept: application/json'

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/reviews/{userId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reviews/{userId}`

Get all reviews received by a specific user (typically a listener). Includes rating statistics and distribution.

<h3 id="get-user-reviews-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|User ID to get reviews for|
|limit|query|integer|false|Number of reviews to return|
|offset|query|integer|false|Offset for pagination|

> Example responses

> 200 Response

```json
{
  "success": true,
  "reviews": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "sessionType": "call",
      "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
      "reviewerId": "6426b718-0cec-4a62-ba39-47b50ade3870",
      "revieweeId": "6fad12bc-7643-4b0d-8d90-cf8e97d62387",
      "rating": 5,
      "comment": "Great listener, very helpful!",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "stats": {
    "averageRating": 4.5,
    "totalReviews": 42,
    "distribution": {
      "1": 0,
      "2": 1,
      "3": 3,
      "4": 8,
      "5": 30
    }
  },
  "statistics": {},
  "pagination": {
    "limit": 0,
    "offset": 0,
    "total": 0
  }
}
```

<h3 id="get-user-reviews-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User reviews with statistics|Inline|

<h3 id="get-user-reviews-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» reviews|[[Review](#schemareview)]|false|none|none|
|»» id|string(uuid)|false|none|Review unique identifier|
|»» sessionType|string|false|none|Type of session reviewed|
|»» sessionId|string(uuid)|false|none|Session ID that was reviewed|
|»» reviewerId|string(uuid)|false|none|ID of user who submitted the review|
|»» revieweeId|string(uuid)|false|none|ID of user who received the review|
|»» rating|integer|false|none|Rating from 1 to 5 stars|
|»» comment|string|false|none|Optional review comment|
|»» createdAt|string(date-time)|false|none|Review submission timestamp|
|» stats|object|false|none|none|
|»» averageRating|number(float)|false|none|none|
|»» totalReviews|integer|false|none|none|
|»» distribution|object|false|none|none|
|»»» 1|integer|false|none|none|
|»»» 2|integer|false|none|none|
|»»» 3|integer|false|none|none|
|»»» 4|integer|false|none|none|
|»»» 5|integer|false|none|none|
|» statistics|object|false|none|Backward-compatible alias of stats.|
|» pagination|object|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» total|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

<aside class="success">
This operation does not require authentication
</aside>

## Get session reviews

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reviews/session/{sessionType}/{sessionId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reviews/session/{sessionType}/{sessionId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reviews/session/{sessionType}/{sessionId}`

Get all reviews for a specific session (both directions if mutual review).

<h3 id="get-session-reviews-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionType|path|string|true|none|
|sessionId|path|string(uuid)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

> Example responses

> 200 Response

```json
{
  "success": true,
  "reviews": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "sessionType": "call",
      "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
      "reviewerId": "6426b718-0cec-4a62-ba39-47b50ade3870",
      "revieweeId": "6fad12bc-7643-4b0d-8d90-cf8e97d62387",
      "rating": 5,
      "comment": "Great listener, very helpful!",
      "createdAt": "2019-08-24T14:15:22Z",
      "is_my_review": true
    }
  ]
}
```

<h3 id="get-session-reviews-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Session reviews|Inline|

<h3 id="get-session-reviews-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» reviews|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[Review](#schemareview)|false|none|none|
|»»» id|string(uuid)|false|none|Review unique identifier|
|»»» sessionType|string|false|none|Type of session reviewed|
|»»» sessionId|string(uuid)|false|none|Session ID that was reviewed|
|»»» reviewerId|string(uuid)|false|none|ID of user who submitted the review|
|»»» revieweeId|string(uuid)|false|none|ID of user who received the review|
|»»» rating|integer|false|none|Rating from 1 to 5 stars|
|»»» comment|string|false|none|Optional review comment|
|»»» createdAt|string(date-time)|false|none|Review submission timestamp|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» is_my_review|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Check if can review session

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reviews/can-review/{sessionType}/{sessionId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reviews/can-review/{sessionType}/{sessionId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reviews/can-review/{sessionType}/{sessionId}`

Check if the authenticated user can submit a review for a specific session.

<h3 id="check-if-can-review-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionType|path|string|true|none|
|sessionId|path|string(uuid)|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

> Example responses

> 200 Response

```json
{
  "canReview": true,
  "reason": "Session must be ended before you can review",
  "otherUserId": "6d89ab4a-8e55-4619-addb-242c7063f367"
}
```

<h3 id="check-if-can-review-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Review eligibility status|Inline|

<h3 id="check-if-can-review-session-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» canReview|boolean|false|none|none|
|» reason|string|false|none|none|
|» otherUserId|string(uuid)|false|none|ID of the other participant (if canReview is true)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-reports">Reports</h1>

User reporting and moderation system

## Submit a user report

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/reports \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "reportedId": "987e6543-e21b-34d5-a678-426614174111",
  "sessionType": "call",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": "bullying_or_harassment",
  "description": "User made repeated inappropriate comments during the call"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reports',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/reports`

Report a user for inappropriate behavior, harassment, or other violations. Reports must be linked to a specific call/chat session.

> Body parameter

```json
{
  "reportedId": "987e6543-e21b-34d5-a678-426614174111",
  "sessionType": "call",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": "bullying_or_harassment",
  "description": "User made repeated inappropriate comments during the call"
}
```

<h3 id="submit-a-user-report-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» reportedId|body|string(uuid)|true|ID of the user being reported|
|» sessionType|body|string|true|Type of session where incident occurred|
|» sessionId|body|string(uuid)|true|ID of session where incident occurred|
|» reason|body|string|true|none|
|» description|body|string|false|Detailed description of the incident|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» sessionType|call|
|» sessionType|chat|
|» reason|disruptive_behavior|
|» reason|bullying_or_harassment|
|» reason|danger_to_self_or_others|
|» reason|inappropriate_or_unsafe_response|

> Example responses

> 201 Response

```json
{
  "success": true,
  "report": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "reporterId": "997c436a-2349-4904-8879-2f8ba4e8669d",
    "reportedId": "7e2a4dc3-549e-4f0a-9b95-d46235525636",
    "sessionType": "call",
    "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
    "sessionVenterId": "b18b7266-dd8b-4e2e-985b-adc34be7ee73",
    "sessionListenerId": "77c1612d-53c9-44d6-8dd7-8de8046313c2",
    "reason": "bullying_or_harassment",
    "description": "string",
    "status": "pending",
    "adminNotes": "string",
    "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
    "reviewedAt": "2019-08-24T14:15:22Z",
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="submit-a-user-report-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Report submitted successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|

<h3 id="submit-a-user-report-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» report|[Report](#schemareport)|false|none|none|
|»» id|string(uuid)|false|none|Report unique identifier|
|»» reporterId|string(uuid)|false|none|ID of user who submitted the report|
|»» reportedId|string(uuid)|false|none|ID of user being reported|
|»» sessionType|string|false|none|Type of session (if applicable)|
|»» sessionId|string(uuid)|false|none|Session ID where the incident occurred|
|»» sessionVenterId|string(uuid)|false|none|Resolved venter ID from the linked session|
|»» sessionListenerId|string(uuid)|false|none|Resolved listener ID from the linked session|
|»» reason|string|false|none|Reason for report|
|»» description|string|false|none|Detailed description of the incident|
|»» status|string|false|none|Current status of the report|
|»» adminNotes|string|false|none|Admin notes (admin only)|
|»» reviewedBy|string(uuid)|false|none|ID of admin who reviewed the report|
|»» reviewedAt|string(date-time)|false|none|Timestamp when report was reviewed|
|»» createdAt|string(date-time)|false|none|Report submission timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get my submitted reports

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reports/my-reports \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reports/my-reports',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reports/my-reports`

Get all reports submitted by the authenticated user.

<h3 id="get-my-submitted-reports-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|none|
|offset|query|integer|false|none|
|status|query|string|false|Filter by report status|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

> Example responses

> 200 Response

```json
{
  "success": true,
  "reports": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "reporterId": "997c436a-2349-4904-8879-2f8ba4e8669d",
      "reportedId": "7e2a4dc3-549e-4f0a-9b95-d46235525636",
      "sessionType": "call",
      "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
      "sessionVenterId": "b18b7266-dd8b-4e2e-985b-adc34be7ee73",
      "sessionListenerId": "77c1612d-53c9-44d6-8dd7-8de8046313c2",
      "reason": "bullying_or_harassment",
      "description": "string",
      "status": "pending",
      "adminNotes": "string",
      "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
      "reviewedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "limit": 0,
    "offset": 0,
    "total": 0
  }
}
```

<h3 id="get-my-submitted-reports-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of submitted reports|Inline|

<h3 id="get-my-submitted-reports-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» reports|[[Report](#schemareport)]|false|none|none|
|»» id|string(uuid)|false|none|Report unique identifier|
|»» reporterId|string(uuid)|false|none|ID of user who submitted the report|
|»» reportedId|string(uuid)|false|none|ID of user being reported|
|»» sessionType|string|false|none|Type of session (if applicable)|
|»» sessionId|string(uuid)|false|none|Session ID where the incident occurred|
|»» sessionVenterId|string(uuid)|false|none|Resolved venter ID from the linked session|
|»» sessionListenerId|string(uuid)|false|none|Resolved listener ID from the linked session|
|»» reason|string|false|none|Reason for report|
|»» description|string|false|none|Detailed description of the incident|
|»» status|string|false|none|Current status of the report|
|»» adminNotes|string|false|none|Admin notes (admin only)|
|»» reviewedBy|string(uuid)|false|none|ID of admin who reviewed the report|
|»» reviewedAt|string(date-time)|false|none|Timestamp when report was reviewed|
|»» createdAt|string(date-time)|false|none|Report submission timestamp|
|» pagination|object|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» total|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get all reports (Admin)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reports/admin/all \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reports/admin/all',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reports/admin/all`

Get all reports in the system with filtering. Accessible by admin and active sub-admin users with admin-panel view permission.

<h3 id="get-all-reports-(admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|none|
|offset|query|integer|false|none|
|status|query|string|false|none|
|reason|query|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|

> Example responses

> 200 Response

```json
{
  "success": true,
  "reports": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "reporterId": "997c436a-2349-4904-8879-2f8ba4e8669d",
      "reportedId": "7e2a4dc3-549e-4f0a-9b95-d46235525636",
      "sessionType": "call",
      "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
      "sessionVenterId": "b18b7266-dd8b-4e2e-985b-adc34be7ee73",
      "sessionListenerId": "77c1612d-53c9-44d6-8dd7-8de8046313c2",
      "reason": "bullying_or_harassment",
      "description": "string",
      "status": "pending",
      "adminNotes": "string",
      "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
      "reviewedAt": "2019-08-24T14:15:22Z",
      "createdAt": "2019-08-24T14:15:22Z",
      "reporter_email": "user@example.com",
      "reported_email": "user@example.com"
    }
  ],
  "stats": {
    "pending": 0,
    "reviewing": 0,
    "resolved": 0,
    "dismissed": 0
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 100
  }
}
```

<h3 id="get-all-reports-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of all reports with statistics|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Admin access required|[Error](#schemaerror)|

<h3 id="get-all-reports-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» reports|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[Report](#schemareport)|false|none|none|
|»»» id|string(uuid)|false|none|Report unique identifier|
|»»» reporterId|string(uuid)|false|none|ID of user who submitted the report|
|»»» reportedId|string(uuid)|false|none|ID of user being reported|
|»»» sessionType|string|false|none|Type of session (if applicable)|
|»»» sessionId|string(uuid)|false|none|Session ID where the incident occurred|
|»»» sessionVenterId|string(uuid)|false|none|Resolved venter ID from the linked session|
|»»» sessionListenerId|string(uuid)|false|none|Resolved listener ID from the linked session|
|»»» reason|string|false|none|Reason for report|
|»»» description|string|false|none|Detailed description of the incident|
|»»» status|string|false|none|Current status of the report|
|»»» adminNotes|string|false|none|Admin notes (admin only)|
|»»» reviewedBy|string(uuid)|false|none|ID of admin who reviewed the report|
|»»» reviewedAt|string(date-time)|false|none|Timestamp when report was reviewed|
|»»» createdAt|string(date-time)|false|none|Report submission timestamp|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» reporter_email|string(email)|false|none|none|
|»»» reported_email|string(email)|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» stats|object|false|none|none|
|»» pending|integer|false|none|none|
|»» reviewing|integer|false|none|none|
|»» resolved|integer|false|none|none|
|»» dismissed|integer|false|none|none|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» limit|integer|false|none|Number of items per page|
|»» offset|integer|false|none|Number of items to skip|
|»» total|integer|false|none|Total number of items|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get report statistics (Admin)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reports/admin/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reports/admin/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reports/admin/stats`

Get comprehensive statistics about reports. Accessible by admin and active sub-admin users with admin-panel view permission.

> Example responses

> 200 Response

```json
{
  "success": true,
  "stats": {
    "byStatus": {
      "property1": 0,
      "property2": 0
    },
    "byReason": {
      "property1": 0,
      "property2": 0
    },
    "last30Days": [
      {
        "date": "2019-08-24",
        "count": 0
      }
    ],
    "topReportedUsers": [
      {
        "reported_id": "b5bce061-db1e-4df5-9099-7920f4bfa699",
        "email": "user@example.com",
        "user_type": "string",
        "report_count": 0
      }
    ],
    "applicationStatus24h": {
      "window": "last_24_hours",
      "generatedAt": "2019-08-24T14:15:22Z",
      "cards": {
        "activeUsers": {
          "value": 7265,
          "changePercent": 11.01
        },
        "monthlySessions": {
          "value": 3671,
          "changePercent": -0.03
        },
        "newSignups": {
          "value": 256,
          "changePercent": 15.03
        },
        "listenerOnlineMinutes": {
          "value": 2318,
          "changePercent": 6.08
        }
      },
      "userProgressEngagementRatio": [
        {
          "hour": "2019-08-24T14:15:22Z",
          "activeUsers": 3140,
          "sessions": 1020,
          "engagementRatio": 3.08
        }
      ]
    }
  }
}
```

<h3 id="get-report-statistics-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Report statistics|Inline|

<h3 id="get-report-statistics-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» stats|object|false|none|none|
|»» byStatus|object|false|none|none|
|»»» **additionalProperties**|integer|false|none|none|
|»» byReason|object|false|none|none|
|»»» **additionalProperties**|integer|false|none|none|
|»» last30Days|[object]|false|none|none|
|»»» date|string(date)|false|none|none|
|»»» count|integer|false|none|none|
|»» topReportedUsers|[object]|false|none|none|
|»»» reported_id|string(uuid)|false|none|none|
|»»» email|string(email)|false|none|none|
|»»» user_type|string|false|none|none|
|»»» report_count|integer|false|none|none|
|»» applicationStatus24h|object|false|none|none|
|»»» window|string|false|none|none|
|»»» generatedAt|string(date-time)|false|none|none|
|»»» cards|object|false|none|none|
|»»»» activeUsers|object|false|none|none|
|»»»»» value|integer|false|none|none|
|»»»»» changePercent|number(float)|false|none|none|
|»»»» monthlySessions|object|false|none|none|
|»»»»» value|integer|false|none|none|
|»»»»» changePercent|number(float)|false|none|none|
|»»»» newSignups|object|false|none|none|
|»»»»» value|integer|false|none|none|
|»»»»» changePercent|number(float)|false|none|none|
|»»»» listenerOnlineMinutes|object|false|none|none|
|»»»»» value|integer|false|none|none|
|»»»»» changePercent|number(float)|false|none|none|
|»»» userProgressEngagementRatio|[object]|false|none|none|
|»»»» hour|string(date-time)|false|none|none|
|»»»» activeUsers|integer|false|none|none|
|»»»» sessions|integer|false|none|none|
|»»»» engagementRatio|number(float)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get report details (Admin)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/reports/admin/{reportId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reports/admin/{reportId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/reports/admin/{reportId}`

Get detailed information about a specific report. Accessible by admin and active sub-admin users with admin-panel view permission.

<h3 id="get-report-details-(admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|reportId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "report": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "reporterId": "997c436a-2349-4904-8879-2f8ba4e8669d",
    "reportedId": "7e2a4dc3-549e-4f0a-9b95-d46235525636",
    "sessionType": "call",
    "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
    "sessionVenterId": "b18b7266-dd8b-4e2e-985b-adc34be7ee73",
    "sessionListenerId": "77c1612d-53c9-44d6-8dd7-8de8046313c2",
    "reason": "bullying_or_harassment",
    "description": "string",
    "status": "pending",
    "adminNotes": "string",
    "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
    "reviewedAt": "2019-08-24T14:15:22Z",
    "createdAt": "2019-08-24T14:15:22Z",
    "reporter_email": "user@example.com",
    "reporter_type": "string",
    "reported_email": "user@example.com",
    "reported_type": "string",
    "reviewer_email": "user@example.com"
  }
}
```

<h3 id="get-report-details-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Report details|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Report not found|[Error](#schemaerror)|

<h3 id="get-report-details-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» report|any|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|[Report](#schemareport)|false|none|none|
|»»» id|string(uuid)|false|none|Report unique identifier|
|»»» reporterId|string(uuid)|false|none|ID of user who submitted the report|
|»»» reportedId|string(uuid)|false|none|ID of user being reported|
|»»» sessionType|string|false|none|Type of session (if applicable)|
|»»» sessionId|string(uuid)|false|none|Session ID where the incident occurred|
|»»» sessionVenterId|string(uuid)|false|none|Resolved venter ID from the linked session|
|»»» sessionListenerId|string(uuid)|false|none|Resolved listener ID from the linked session|
|»»» reason|string|false|none|Reason for report|
|»»» description|string|false|none|Detailed description of the incident|
|»»» status|string|false|none|Current status of the report|
|»»» adminNotes|string|false|none|Admin notes (admin only)|
|»»» reviewedBy|string(uuid)|false|none|ID of admin who reviewed the report|
|»»» reviewedAt|string(date-time)|false|none|Timestamp when report was reviewed|
|»»» createdAt|string(date-time)|false|none|Report submission timestamp|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» reporter_email|string(email)|false|none|none|
|»»» reporter_type|string|false|none|none|
|»»» reported_email|string(email)|false|none|none|
|»»» reported_type|string|false|none|none|
|»»» reviewer_email|string(email)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update report status (Admin)

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/reports/admin/{reportId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "status": "resolved",
  "adminNotes": "Investigated and took appropriate action"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/reports/admin/{reportId}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/reports/admin/{reportId}`

Update the status and add admin notes to a report. Accessible by admin and active sub-admin users with admin-panel edit permission.

> Body parameter

```json
{
  "status": "resolved",
  "adminNotes": "Investigated and took appropriate action"
}
```

<h3 id="update-report-status-(admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|reportId|path|string(uuid)|true|none|
|body|body|object|true|none|
|» status|body|string|true|none|
|» adminNotes|body|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» status|pending|
|» status|reviewing|
|» status|resolved|
|» status|dismissed|

> Example responses

> 200 Response

```json
{
  "success": true,
  "report": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "reporterId": "997c436a-2349-4904-8879-2f8ba4e8669d",
    "reportedId": "7e2a4dc3-549e-4f0a-9b95-d46235525636",
    "sessionType": "call",
    "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
    "sessionVenterId": "b18b7266-dd8b-4e2e-985b-adc34be7ee73",
    "sessionListenerId": "77c1612d-53c9-44d6-8dd7-8de8046313c2",
    "reason": "bullying_or_harassment",
    "description": "string",
    "status": "pending",
    "adminNotes": "string",
    "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
    "reviewedAt": "2019-08-24T14:15:22Z",
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="update-report-status-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Report updated successfully|Inline|

<h3 id="update-report-status-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» report|[Report](#schemareport)|false|none|none|
|»» id|string(uuid)|false|none|Report unique identifier|
|»» reporterId|string(uuid)|false|none|ID of user who submitted the report|
|»» reportedId|string(uuid)|false|none|ID of user being reported|
|»» sessionType|string|false|none|Type of session (if applicable)|
|»» sessionId|string(uuid)|false|none|Session ID where the incident occurred|
|»» sessionVenterId|string(uuid)|false|none|Resolved venter ID from the linked session|
|»» sessionListenerId|string(uuid)|false|none|Resolved listener ID from the linked session|
|»» reason|string|false|none|Reason for report|
|»» description|string|false|none|Detailed description of the incident|
|»» status|string|false|none|Current status of the report|
|»» adminNotes|string|false|none|Admin notes (admin only)|
|»» reviewedBy|string(uuid)|false|none|ID of admin who reviewed the report|
|»» reviewedAt|string(date-time)|false|none|Timestamp when report was reviewed|
|»» createdAt|string(date-time)|false|none|Report submission timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-listener-verification">Listener Verification</h1>

Listener verification document upload and review flows

## Submit verification document

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/listener-verifications \
  -H 'Content-Type: multipart/form-data' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "document": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/listener-verifications',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/listener-verifications`

Listener uploads a verification document for admin review. Accepts PDF, PNG, JPG, and JPEG files up to 10MB.

> Body parameter

```yaml
document: string

```

<h3 id="submit-verification-document-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» document|body|string(binary)|true|Verification document file. Allowed MIME: application/pdf, image/png, image/jpeg, image/jpg. Max size: 10MB.|

> Example responses

> 201 Response

```json
{
  "success": true,
  "verification": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "pending",
    "createdAt": "2026-02-25T10:20:30.000Z"
  }
}
```

<h3 id="submit-verification-document-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Verification document submitted|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error or invalid file upload|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (listener role required)|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Pending verification already exists|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="submit-verification-document-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» verification|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **409**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get my verification submissions

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/listener-verifications/me \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/listener-verifications/me',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/listener-verifications/me`

List verification document submissions for the authenticated listener

<h3 id="get-my-verification-submissions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|Maximum number of submissions to return|
|offset|query|integer|false|Number of submissions to skip|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submissions": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "status": "pending",
      "admin_notes": "Please upload a clearer scan",
      "reviewed_at": "2019-08-24T14:15:22Z",
      "created_at": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="get-my-verification-submissions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification submissions retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (listener role required)|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="get-my-verification-submissions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submissions|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» admin_notes|string¦null|false|none|none|
|»» reviewed_at|string(date-time)¦null|false|none|none|
|»» created_at|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## List listener verification submissions (admin)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/listener-verifications/admin/all \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/listener-verifications/admin/all',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/listener-verifications/admin/all`

Admin endpoint to list listener verification submissions with optional status filtering. Accessible by admin and active sub-admin users with admin-panel view permission.

<h3 id="list-listener-verification-submissions-(admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|status|query|string|false|Filter by submission status|
|limit|query|integer|false|Maximum number of submissions to return|
|offset|query|integer|false|Number of submissions to skip|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submissions": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "listener_id": "68633f4f-f52a-402f-8572-b8173418904f",
      "listener_email": "listener@example.com",
      "status": "pending",
      "mime_type": "application/pdf",
      "original_file_name": "license.pdf",
      "created_at": "2019-08-24T14:15:22Z",
      "reviewed_at": "2019-08-24T14:15:22Z",
      "reviewed_by": "92ab4dbc-1b27-40ce-b24b-7dde8f4709be"
    }
  ]
}
```

<h3 id="list-listener-verification-submissions-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification submissions retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="list-listener-verification-submissions-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submissions|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» listener_id|string(uuid)|false|none|none|
|»» listener_email|string(email)|false|none|none|
|»» status|string|false|none|none|
|»» mime_type|string|false|none|none|
|»» original_file_name|string|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» reviewed_at|string(date-time)¦null|false|none|none|
|»» reviewed_by|string(uuid)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get verification submission detail (admin)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/listener-verifications/admin/{verificationId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/listener-verifications/admin/{verificationId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/listener-verifications/admin/{verificationId}`

Admin endpoint to fetch one verification submission, including document access URL. Accessible by admin and active sub-admin users with admin-panel view permission.

<h3 id="get-verification-submission-detail-(admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|verificationId|path|string(uuid)|true|Verification submission ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submission": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "listener_id": "68633f4f-f52a-402f-8572-b8173418904f",
    "listener_email": "listener@example.com",
    "status": "pending",
    "s3_key": "listener-verification/8b5f9f57-a56a-457d-95a6-85023d53a7f7/21de7047-cf31-4f4d-bde2-225a4c74c4d2-license.pdf",
    "file_url": "https://bucket.s3.amazonaws.com/listener-verification/...",
    "mime_type": "application/pdf",
    "original_file_name": "license.pdf",
    "file_size_bytes": 542111,
    "admin_notes": "Document verified successfully",
    "reviewed_by": "92ab4dbc-1b27-40ce-b24b-7dde8f4709be",
    "reviewed_at": "2019-08-24T14:15:22Z",
    "s3_deleted_at": "2019-08-24T14:15:22Z",
    "created_at": "2019-08-24T14:15:22Z",
    "updated_at": "2019-08-24T14:15:22Z",
    "document_url": "https://bucket.s3.amazonaws.com/listener-verification/...presigned"
  }
}
```

<h3 id="get-verification-submission-detail-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Verification submission retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Submission not found|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="get-verification-submission-detail-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submission|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» listener_id|string(uuid)|false|none|none|
|»» listener_email|string(email)|false|none|none|
|»» status|string|false|none|none|
|»» s3_key|string¦null|false|none|none|
|»» file_url|string¦null|false|none|none|
|»» mime_type|string|false|none|none|
|»» original_file_name|string|false|none|none|
|»» file_size_bytes|integer|false|none|none|
|»» admin_notes|string¦null|false|none|none|
|»» reviewed_by|string(uuid)¦null|false|none|none|
|»» reviewed_at|string(date-time)¦null|false|none|none|
|»» s3_deleted_at|string(date-time)¦null|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» updated_at|string(date-time)|false|none|none|
|»» document_url|string¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Review verification submission (admin)

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/listener-verifications/admin/{verificationId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "status": "verified",
  "adminNotes": "Document is valid and approved."
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/listener-verifications/admin/{verificationId}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/listener-verifications/admin/{verificationId}`

Admin approves or rejects a pending listener verification submission. Accessible by admin and active sub-admin users with admin-panel edit permission.

> Body parameter

```json
{
  "status": "verified",
  "adminNotes": "Document is valid and approved."
}
```

<h3 id="review-verification-submission-(admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|verificationId|path|string(uuid)|true|Verification submission ID|
|body|body|object|true|none|
|» status|body|string|true|Admin decision. `verified` is normalized to `approved` in API responses.|
|» adminNotes|body|string¦null|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» status|verified|
|» status|rejected|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submission": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "listener_id": "68633f4f-f52a-402f-8572-b8173418904f",
    "status": "approved",
    "reviewed_at": "2019-08-24T14:15:22Z",
    "s3_deleted_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="review-verification-submission-(admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Submission reviewed|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Submission not found|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Submission is not pending|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="review-verification-submission-(admin)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submission|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» listener_id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» reviewed_at|string(date-time)|false|none|none|
|»» s3_deleted_at|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|approved|
|status|rejected|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **409**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-support">Support</h1>

User support endpoints for appeals and feedback

## Submit an appeal

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/support/appeals \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "reason": "account_restriction",
  "description": "I would like this moderation decision reviewed.",
  "attachments": [
    "https://example.com/attachment-1.png",
    "https://example.com/attachment-2.pdf"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/support/appeals',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/support/appeals`

Submit a platform appeal with reason, description, and optional attachment references

> Body parameter

```json
{
  "reason": "account_restriction",
  "description": "I would like this moderation decision reviewed.",
  "attachments": [
    "https://example.com/attachment-1.png",
    "https://example.com/attachment-2.pdf"
  ]
}
```

<h3 id="submit-an-appeal-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» reason|body|string|true|none|
|» description|body|string|false|none|
|» attachments|body|[string]|false|none|

> Example responses

> 401 Response

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}
```

<h3 id="submit-an-appeal-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Appeal submitted successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Submit appeal with document (listener or venter)

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/support/listener-appeals \
  -H 'Content-Type: multipart/form-data' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "contact": "princesskaguya@gmail.com",
  "reportId": "RPT-2026-00129",
  "summary": "I want to appeal this report and provide additional context.",
  "document": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/support/listener-appeals',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/support/listener-appeals`

Listener or venter endpoint to submit an appeal including contact info, report reference, summary, and a required PDF/DOC/DOCX document

> Body parameter

```yaml
contact: princesskaguya@gmail.com
reportId: RPT-2026-00129
summary: I want to appeal this report and provide additional context.
document: string

```

<h3 id="submit-appeal-with-document-(listener-or-venter)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» contact|body|string|true|Listener email or phone number|
|» reportId|body|string|true|Report identifier tied to this appeal|
|» summary|body|string|true|none|
|» document|body|string(binary)|true|Appeal document file (PDF, DOC, DOCX up to 10MB)|

> Example responses

> 201 Response

```json
{
  "success": true,
  "appeal": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "submitted",
    "contact": "princesskaguya@gmail.com",
    "reportId": "RPT-2026-00129",
    "summary": "I want to appeal this report and provide additional context.",
    "documentUrl": "https://example-bucket.s3.us-east-1.amazonaws.com/support-appeals/user/file.pdf",
    "createdAt": "2026-02-25T09:30:00.000Z"
  }
}
```

<h3 id="submit-appeal-with-document-(listener-or-venter)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Appeal submitted successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error or invalid file|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (listener or venter role required)|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="submit-appeal-with-document-(listener-or-venter)-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» appeal|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» contact|string|false|none|none|
|»» reportId|string|false|none|none|
|»» summary|string|false|none|none|
|»» documentUrl|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Submit platform feedback

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/support/feedback \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "rating": 5,
  "comment": "Great app experience overall."
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/support/feedback',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/support/feedback`

Submit generic product feedback with a rating and optional comment

> Body parameter

```json
{
  "rating": 5,
  "comment": "Great app experience overall."
}
```

<h3 id="submit-platform-feedback-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» rating|body|number|true|none|
|» comment|body|string|false|none|

> Example responses

> 401 Response

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}
```

<h3 id="submit-platform-feedback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Feedback submitted successfully|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-blocking">Blocking</h1>

User blocking functionality

## Block a user

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/users/{userId}/block \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/users/{userId}/block',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /users/{userId}/block`

Block a user to prevent them from initiating calls or chats with you. Blocked users won't be matched in the system.

<h3 id="block-a-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|ID of the user to block|

> Example responses

> 201 Response

```json
{
  "message": "User blocked successfully",
  "block": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "blockedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="block-a-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User blocked successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error (e.g., trying to block yourself)|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|User is already blocked|[Error](#schemaerror)|

<h3 id="block-a-user-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» block|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» blockedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Unblock a user

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/users/{userId}/block \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/users/{userId}/block',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /users/{userId}/block`

Remove a user from your blocked list, allowing them to interact with you again.

<h3 id="unblock-a-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|ID of the user to unblock|

> Example responses

> 200 Response

```json
{
  "message": "User unblocked successfully"
}
```

<h3 id="unblock-a-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User unblocked successfully|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Block relationship not found|[Error](#schemaerror)|

<h3 id="unblock-a-user-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Check if user is blocked

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/users/{userId}/blocked \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/users/{userId}/blocked',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /users/{userId}/blocked`

Check the block status between you and another user (both directions).

<h3 id="check-if-user-is-blocked-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|ID of the user to check|

> Example responses

> 200 Response

```json
{
  "isBlocked": true,
  "blockType": "you_blocked",
  "blockedAt": "2019-08-24T14:15:22Z"
}
```

<h3 id="check-if-user-is-blocked-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Block status|Inline|

<h3 id="check-if-user-is-blocked-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» isBlocked|boolean|false|none|none|
|» blockType|string|false|none|none|
|» blockedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|blockType|you_blocked|
|blockType|blocked_by_them|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get blocked users list

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/users/blocked \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/users/blocked',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /users/blocked`

Retrieve a paginated list of users you have blocked.

<h3 id="get-blocked-users-list-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Page number (starts from 1)|
|limit|query|integer|false|Number of items per page|

> Example responses

> 200 Response

```json
{
  "blockedUsers": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "blocked_id": "1d3a7133-9a57-4f11-a58d-14c030d99172",
      "username": "user123",
      "role": "listener",
      "blocked_at": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 100
  }
}
```

<h3 id="get-blocked-users-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of blocked users|Inline|

<h3 id="get-blocked-users-list-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» blockedUsers|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» blocked_id|string(uuid)|false|none|none|
|»» username|string|false|none|none|
|»» role|string|false|none|none|
|»» blocked_at|string(date-time)|false|none|none|
|» pagination|[Pagination](#schemapagination)|false|none|none|
|»» limit|integer|false|none|Number of items per page|
|»» offset|integer|false|none|Number of items to skip|
|»» total|integer|false|none|Total number of items|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-admin">Admin</h1>

Administrative endpoints (admin and permissioned sub-admin)

## Get AI admin settings

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin-settings/ai \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin-settings/ai',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin-settings/ai`

Fetch current AI settings used by the Admin Settings AI screen. Accessible by admin and active sub-admin users with admin-panel view permission.

> Example responses

> 200 Response

```json
{
  "success": true,
  "settings": {
    "ai_enabled": false,
    "ai_crisis_detection_enabled": false,
    "ai_crisis_sensitivity": 0.7,
    "ai_auto_escalation_enabled": false
  }
}
```

<h3 id="get-ai-admin-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AI settings retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="get-ai-admin-settings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» settings|object|false|none|none|
|»» ai_enabled|boolean|false|none|none|
|»» ai_crisis_detection_enabled|boolean|false|none|none|
|»» ai_crisis_sensitivity|number|false|none|none|
|»» ai_auto_escalation_enabled|boolean|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update AI admin settings

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/admin-settings/ai \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "ai_enabled": true,
  "ai_crisis_detection_enabled": true,
  "ai_crisis_sensitivity": 0.85,
  "ai_auto_escalation_enabled": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin-settings/ai',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/admin-settings/ai`

Update one or more AI settings used by the Admin Settings AI screen. Accessible by admin and active sub-admin users with admin-panel edit permission.

> Body parameter

```json
{
  "ai_enabled": true,
  "ai_crisis_detection_enabled": true,
  "ai_crisis_sensitivity": 0.85,
  "ai_auto_escalation_enabled": true
}
```

<h3 id="update-ai-admin-settings-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» ai_enabled|body|boolean|false|none|
|» ai_crisis_detection_enabled|body|boolean|false|none|
|» ai_crisis_sensitivity|body|number|false|none|
|» ai_auto_escalation_enabled|body|boolean|false|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "message": "AI settings updated successfully",
  "settings": {
    "ai_enabled": true,
    "ai_crisis_detection_enabled": true,
    "ai_crisis_sensitivity": 0.85,
    "ai_auto_escalation_enabled": true
  }
}
```

<h3 id="update-ai-admin-settings-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AI settings updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="update-ai-admin-settings-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» settings|object|false|none|none|
|»» ai_enabled|boolean|false|none|none|
|»» ai_crisis_detection_enabled|boolean|false|none|none|
|»» ai_crisis_sensitivity|number|false|none|none|
|»» ai_auto_escalation_enabled|boolean|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## List exports and integrations users

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/integrations \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/integrations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/integrations`

List non-privileged users for admin exports/integrations screens with search, role, status, and pagination.

<h3 id="list-exports-and-integrations-users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|search|query|string|false|none|
|userId|query|string(uuid)|false|none|
|role|query|string|false|none|
|status|query|string|false|none|
|limit|query|integer|false|none|
|offset|query|integer|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|role|venter|
|role|listener|
|role|both|
|status|exported|
|status|pending|
|status|not_exported|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "email": "user@example.com",
      "accountType": "venter",
      "stats": {
        "totalSessions": 0,
        "totalMinutes": 0,
        "totalPayout": 0
      },
      "exportStatus": "exported",
      "exportedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 0,
    "offset": 0
  }
}
```

<h3 id="list-exports-and-integrations-users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Integrations list retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="list-exports-and-integrations-users-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» accountType|string|false|none|none|
|»» stats|object|false|none|none|
|»»» totalSessions|integer|false|none|none|
|»»» totalMinutes|integer|false|none|none|
|»»» totalPayout|number|false|none|none|
|»» exportStatus|string|false|none|none|
|»» exportedAt|string(date-time)¦null|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accountType|venter|
|accountType|listener|
|accountType|both|
|accountType|unknown|
|exportStatus|exported|
|exportStatus|pending|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Export integrations as PDF

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/integrations/export/pdf \
  -H 'Accept: application/pdf' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/pdf',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/integrations/export/pdf',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/integrations/export/pdf`

Export admin integrations list to a downloadable PDF. Supports the same filters as list integrations.

<h3 id="export-integrations-as-pdf-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|search|query|string|false|none|
|userId|query|string(uuid)|false|none|
|role|query|string|false|none|
|status|query|string|false|none|
|maxRows|query|integer|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|role|venter|
|role|listener|
|role|both|
|status|exported|
|status|pending|
|status|not_exported|

> Example responses

> 200 Response

> 401 Response

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}
```

<h3 id="export-integrations-as-pdf-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|PDF file generated|string|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update user export status

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/admin/integrations/{userId}/export-status \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "exported": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/integrations/{userId}/export-status',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/admin/integrations/{userId}/export-status`

Update export status for a non-privileged user in admin exports/integrations screens.

> Body parameter

```json
{
  "exported": true
}
```

<h3 id="update-user-export-status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|none|
|body|body|object|true|none|
|» exported|body|boolean|true|none|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "integration": {
    "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
    "email": "user@example.com",
    "exportStatus": "exported"
  }
}
```

<h3 id="update-user-export-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Export status updated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="update-user-export-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» integration|object|false|none|none|
|»» userId|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» exportStatus|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|exportStatus|exported|
|exportStatus|pending|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## List payment history

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/payments/history \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/payments/history',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/payments/history`

List checkout payment history across users for admin payment history screens.

<h3 id="list-payment-history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|search|query|string|false|none|
|userId|query|string(uuid)|false|none|
|status|query|string|false|none|
|from|query|string(date-time)|false|none|
|to|query|string(date-time)|false|none|
|limit|query|integer|false|none|
|offset|query|integer|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|completed|
|status|expired|
|status|failed|

> Example responses

> 200 Response

```json
{
  "payments": [
    {
      "id": "string",
      "amount": 0,
      "currency": "string",
      "status": "string",
      "mode": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "completedAt": "2019-08-24T14:15:22Z",
      "user": {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "email": "user@example.com"
      }
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 0,
    "offset": 0
  }
}
```

<h3 id="list-payment-history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Payment history retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="list-payment-history-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» payments|[object]|false|none|none|
|»» id|string|false|none|none|
|»» amount|number¦null|false|none|none|
|»» currency|string¦null|false|none|none|
|»» status|string|false|none|none|
|»» mode|string¦null|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» completedAt|string(date-time)¦null|false|none|none|
|»» user|object|false|none|none|
|»»» id|string(uuid)|false|none|none|
|»»» email|string(email)|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Export payment history as PDF

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/payments/history/export/pdf \
  -H 'Accept: application/pdf' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/pdf',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/payments/history/export/pdf',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/payments/history/export/pdf`

Export admin payment history to a downloadable PDF. Supports the same filters as payment history list.

<h3 id="export-payment-history-as-pdf-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|search|query|string|false|none|
|userId|query|string(uuid)|false|none|
|status|query|string|false|none|
|from|query|string(date-time)|false|none|
|to|query|string(date-time)|false|none|
|maxRows|query|integer|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|completed|
|status|expired|
|status|failed|

> Example responses

> 200 Response

> 401 Response

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}
```

<h3 id="export-payment-history-as-pdf-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|PDF file generated|string|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get admin finance payment stats

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/payments/stats \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/payments/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/payments/stats`

Returns admin finance stats for dashboard cards/charts: weekly revenue increase (last 7 days vs previous 7 days), next expected revenue (next 7 days), and weekly sales trend (last 8 weeks).

> Example responses

> 200 Response

```json
{
  "generatedAt": "2019-08-24T14:15:22Z",
  "currency": "USD",
  "weeklyRevenueIncrease": {
    "windowDays": 7,
    "currentRevenue": 1234.56,
    "previousRevenue": 1120.12,
    "increasePercent": 10.22
  },
  "nextExpectedRevenue": {
    "windowDays": 7,
    "totalRevenue": 1500,
    "subscriptionCount": 18,
    "stripeInvoiceCount": 15,
    "fallbackEstimateCount": 3,
    "fromDate": "2019-08-24T14:15:22Z",
    "toDate": "2019-08-24T14:15:22Z"
  },
  "weeklySalesData": {
    "windowWeeks": 8,
    "series": [
      {
        "weekStart": "2019-08-24T14:15:22Z",
        "weekEnd": "2019-08-24T14:15:22Z",
        "revenue": 2450.75
      }
    ]
  }
}
```

<h3 id="get-admin-finance-payment-stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Admin payment stats retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-admin-finance-payment-stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» generatedAt|string(date-time)|false|none|none|
|» currency|string|false|none|none|
|» weeklyRevenueIncrease|object|false|none|none|
|»» windowDays|integer|false|none|none|
|»» currentRevenue|number|false|none|none|
|»» previousRevenue|number|false|none|none|
|»» increasePercent|number|false|none|none|
|» nextExpectedRevenue|object|false|none|none|
|»» windowDays|integer|false|none|none|
|»» totalRevenue|number|false|none|none|
|»» subscriptionCount|integer|false|none|none|
|»» stripeInvoiceCount|integer|false|none|none|
|»» fallbackEstimateCount|integer|false|none|none|
|»» fromDate|string(date-time)|false|none|none|
|»» toDate|string(date-time)|false|none|none|
|» weeklySalesData|object|false|none|none|
|»» windowWeeks|integer|false|none|none|
|»» series|[object]|false|none|none|
|»»» weekStart|string(date-time)|false|none|none|
|»»» weekEnd|string(date-time)|false|none|none|
|»»» revenue|number|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## List users for admin moderation

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/users \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/users',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/users`

List non-privileged users for admin moderation screens with search, role filtering, and pagination. Accessible by admin and active sub-admin users with admin-panel view permission.

<h3 id="list-users-for-admin-moderation-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|search|query|string|false|Search by user email or user ID|
|role|query|string|false|Filter by account role composition|
|limit|query|integer|false|Maximum number of users to return|
|offset|query|integer|false|Number of users to skip|

#### Enumerated Values

|Parameter|Value|
|---|---|
|role|venter|
|role|listener|
|role|both|

> Example responses

> 200 Response

```json
{
  "users": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "email": "user@example.com",
      "activeRole": "string",
      "availableRoles": [
        "string"
      ],
      "accountType": "venter",
      "isActive": true,
      "stats": {
        "totalSessions": 42,
        "totalMinutes": 318,
        "totalPayout": 64.5
      },
      "createdAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 125,
    "limit": 20,
    "offset": 0
  }
}
```

<h3 id="list-users-for-admin-moderation-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Users retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="list-users-for-admin-moderation-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» users|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» activeRole|string|false|none|none|
|»» availableRoles|[string]|false|none|none|
|»» accountType|string|false|none|none|
|»» isActive|boolean|false|none|none|
|»» stats|object|false|none|none|
|»»» totalSessions|integer|false|none|none|
|»»» totalMinutes|integer|false|none|none|
|»»» totalPayout|number|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accountType|venter|
|accountType|listener|
|accountType|both|
|accountType|unknown|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Bulk delete users

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/admin/users \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "userIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/users',
{
  method: 'DELETE',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/admin/users`

Delete multiple non-privileged users in one request. Accessible by admin and active sub-admin users with admin-panel delete permission.

> Body parameter

```json
{
  "userIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ]
}
```

<h3 id="bulk-delete-users-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» userIds|body|[string]|true|none|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "deletedCount": 0
}
```

<h3 id="bulk-delete-users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Users deleted|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="bulk-delete-users-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» deletedCount|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Bulk change user roles

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/admin/users/roles \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "userIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "targetRole": "venter"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/users/roles',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/admin/users/roles`

Update available roles for multiple non-privileged users. targetRole supports venter, listener, or both.

> Body parameter

```json
{
  "userIds": [
    "497f6eca-6276-4993-bfeb-53cbbbba6f08"
  ],
  "targetRole": "venter"
}
```

<h3 id="bulk-change-user-roles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» userIds|body|[string]|true|none|
|» targetRole|body|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» targetRole|venter|
|» targetRole|listener|
|» targetRole|both|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "updatedCount": 0
}
```

<h3 id="bulk-change-user-roles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User roles updated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|

<h3 id="bulk-change-user-roles-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» updatedCount|integer|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get comprehensive user detail for moderation

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/users/{userId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/users/{userId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/users/{userId}`

Get comprehensive non-sensitive user profile data, listener attributes, engagement stats, and document metadata for admin moderation screens, including verification document links/states and signature document state. Response includes both the new documents object and backward-compatible verificationDocuments array. Accessible by admin and active sub-admin users with admin-panel view permission.

<h3 id="get-comprehensive-user-detail-for-moderation-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "phone": "string",
    "firstName": "string",
    "lastName": "string",
    "displayName": "string",
    "profilePictureUrl": "string",
    "bio": "string",
    "dateOfBirth": "2019-08-24",
    "userType": "string",
    "activeRole": "string",
    "availableRoles": [
      "string"
    ],
    "accountType": "venter",
    "isVerified": true,
    "isActive": true,
    "listenerSignature": "string",
    "security": {
      "twoFactorAuthentication": {
        "enabled": true,
        "method": "sms"
      }
    },
    "stats": {
      "totalSessions": 0,
      "totalMinutes": 0,
      "totalPayout": 0
    },
    "listenerInfo": {
      "genderIdentity": "string",
      "culturalBackground": "string",
      "language": "string",
      "ethnicity": "string",
      "ageGroup": "string",
      "lgbtqIdentity": "string",
      "specialTopics": [
        "string"
      ],
      "faithOrBelief": "string",
      "verificationStatus": "not_submitted"
    },
    "documents": {
      "verification": [
        {
          "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
          "status": "pending",
          "state": "pending",
          "fileUrl": "string",
          "originalFileName": "string",
          "mimeType": "string",
          "fileSizeBytes": 0,
          "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
          "reviewedAt": "2019-08-24T14:15:22Z",
          "adminNotes": "string",
          "isDeleted": true,
          "deletedAt": "2019-08-24T14:15:22Z",
          "createdAt": "2019-08-24T14:15:22Z"
        }
      ],
      "signature": {
        "type": "signature",
        "status": "available",
        "state": "available",
        "fileUrl": "string",
        "createdAt": "2019-08-24T14:15:22Z",
        "updatedAt": "2019-08-24T14:15:22Z"
      }
    },
    "verificationDocuments": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "status": "pending",
        "state": "pending",
        "fileUrl": "string",
        "originalFileName": "string",
        "mimeType": "string",
        "fileSizeBytes": 0,
        "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
        "reviewedAt": "2019-08-24T14:15:22Z",
        "adminNotes": "string",
        "isDeleted": true,
        "deletedAt": "2019-08-24T14:15:22Z",
        "createdAt": "2019-08-24T14:15:22Z"
      }
    ],
    "createdAt": "2019-08-24T14:15:22Z",
    "updatedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-comprehensive-user-detail-for-moderation-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User detail retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-comprehensive-user-detail-for-moderation-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» user|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string¦null|false|none|none|
|»» firstName|string¦null|false|none|none|
|»» lastName|string¦null|false|none|none|
|»» displayName|string¦null|false|none|none|
|»» profilePictureUrl|string¦null|false|none|none|
|»» bio|string¦null|false|none|none|
|»» dateOfBirth|string(date)¦null|false|none|none|
|»» userType|string|false|none|none|
|»» activeRole|string|false|none|none|
|»» availableRoles|[string]|false|none|none|
|»» accountType|string|false|none|none|
|»» isVerified|boolean|false|none|none|
|»» isActive|boolean|false|none|none|
|»» listenerSignature|string¦null|false|none|none|
|»» security|object|false|none|none|
|»»» twoFactorAuthentication|object|false|none|none|
|»»»» enabled|boolean|false|none|none|
|»»»» method|string¦null|false|none|none|
|»» stats|object|false|none|none|
|»»» totalSessions|integer|false|none|none|
|»»» totalMinutes|integer|false|none|none|
|»»» totalPayout|number|false|none|none|
|»» listenerInfo|object|false|none|none|
|»»» genderIdentity|string¦null|false|none|none|
|»»» culturalBackground|string¦null|false|none|none|
|»»» language|string¦null|false|none|none|
|»»» ethnicity|string¦null|false|none|none|
|»»» ageGroup|string¦null|false|none|none|
|»»» lgbtqIdentity|string¦null|false|none|none|
|»»» specialTopics|[string]|false|none|none|
|»»» faithOrBelief|string¦null|false|none|none|
|»»» verificationStatus|string|false|none|none|
|»» documents|object|false|none|none|
|»»» verification|[object]|false|none|none|
|»»»» id|string(uuid)|false|none|none|
|»»»» status|string|false|none|none|
|»»»» state|string|false|none|none|
|»»»» fileUrl|string¦null|false|none|none|
|»»»» originalFileName|string¦null|false|none|none|
|»»»» mimeType|string¦null|false|none|none|
|»»»» fileSizeBytes|integer¦null|false|none|none|
|»»»» reviewedBy|string(uuid)¦null|false|none|none|
|»»»» reviewedAt|string(date-time)¦null|false|none|none|
|»»»» adminNotes|string¦null|false|none|none|
|»»»» isDeleted|boolean|false|none|none|
|»»»» deletedAt|string(date-time)¦null|false|none|none|
|»»»» createdAt|string(date-time)|false|none|none|
|»»» signature|object|false|none|none|
|»»»» type|string|false|none|none|
|»»»» status|string|false|none|none|
|»»»» state|string|false|none|none|
|»»»» fileUrl|string¦null|false|none|none|
|»»»» createdAt|string(date-time)|false|none|none|
|»»»» updatedAt|string(date-time)|false|none|none|
|»» verificationDocuments|[object]|false|none|none|
|»»» id|string(uuid)|false|none|none|
|»»» status|string|false|none|none|
|»»» state|string|false|none|none|
|»»» fileUrl|string¦null|false|none|none|
|»»» originalFileName|string¦null|false|none|none|
|»»» mimeType|string¦null|false|none|none|
|»»» fileSizeBytes|integer¦null|false|none|none|
|»»» reviewedBy|string(uuid)¦null|false|none|none|
|»»» reviewedAt|string(date-time)¦null|false|none|none|
|»»» adminNotes|string¦null|false|none|none|
|»»» isDeleted|boolean|false|none|none|
|»»» deletedAt|string(date-time)¦null|false|none|none|
|»»» createdAt|string(date-time)|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accountType|venter|
|accountType|listener|
|accountType|both|
|accountType|unknown|
|method|sms|
|method|email|
|method|authenticator_app|
|verificationStatus|not_submitted|
|verificationStatus|pending|
|verificationStatus|approved|
|verificationStatus|rejected|
|status|pending|
|status|approved|
|status|rejected|
|state|pending|
|state|approved|
|state|rejected|
|type|signature|
|status|available|
|status|missing|
|state|available|
|state|missing|
|status|pending|
|status|approved|
|status|rejected|
|state|pending|
|state|approved|
|state|rejected|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Delete user account

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/admin/users/{userId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/users/{userId}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/admin/users/{userId}`

Delete a non-privileged user account. Admin and sub-admin users cannot be deleted by this endpoint. Accessible by admin and active sub-admin users with admin-panel delete permission.

<h3 id="delete-user-account-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "User deleted successfully",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com"
  }
}
```

<h3 id="delete-user-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User deleted|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid operation (self-delete attempted)|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin/sub-admin target or insufficient permission)|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="delete-user-account-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Suspend or reactivate a user

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/admin/users/{userId}/suspend \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "suspended": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/users/{userId}/suspend',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/admin/users/{userId}/suspend`

Suspend or reactivate a non-privileged user account by toggling isActive. Accessible by admin and active sub-admin users with admin-panel suspend permission.

> Body parameter

```json
{
  "suspended": true
}
```

<h3 id="suspend-or-reactivate-a-user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|none|
|body|body|object|false|none|
|» suspended|body|boolean|false|When true, suspend user. When false, reactivate user.|

> Example responses

> 200 Response

```json
{
  "message": "User suspended successfully",
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "isActive": true
  }
}
```

<h3 id="suspend-or-reactivate-a-user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User suspension state updated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid operation (self-suspend attempted)|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin/sub-admin target or insufficient permission)|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="suspend-or-reactivate-a-user-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» user|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» isActive|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## List listener requests (admin alias)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/listener-requests \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/listener-requests',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/listener-requests`

Alias endpoint for listing listener verification submissions for admin moderation screens. Response matches /api/v1/listener-verifications/admin/all.

<h3 id="list-listener-requests-(admin-alias)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|status|query|string|false|none|
|limit|query|integer|false|none|
|offset|query|integer|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submissions": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "listener_id": "68633f4f-f52a-402f-8572-b8173418904f",
      "listener_email": "user@example.com",
      "gender_identity": "string",
      "preferred_language": "string",
      "ethnicity": "string",
      "age_group": "string",
      "lgbtq_identity": "string",
      "special_topics": [
        "string"
      ],
      "faith_or_belief": "string",
      "status": "pending",
      "mime_type": "string",
      "original_file_name": "string",
      "created_at": "2019-08-24T14:15:22Z",
      "reviewed_at": "2019-08-24T14:15:22Z",
      "reviewed_by": "92ab4dbc-1b27-40ce-b24b-7dde8f4709be"
    }
  ]
}
```

<h3 id="list-listener-requests-(admin-alias)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Listener requests retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="list-listener-requests-(admin-alias)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submissions|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» listener_id|string(uuid)|false|none|none|
|»» listener_email|string(email)|false|none|none|
|»» gender_identity|string¦null|false|none|none|
|»» preferred_language|string¦null|false|none|none|
|»» ethnicity|string¦null|false|none|none|
|»» age_group|string¦null|false|none|none|
|»» lgbtq_identity|string¦null|false|none|none|
|»» special_topics|[string]|false|none|none|
|»» faith_or_belief|string¦null|false|none|none|
|»» status|string|false|none|none|
|»» mime_type|string|false|none|none|
|»» original_file_name|string|false|none|none|
|»» created_at|string(date-time)|false|none|none|
|»» reviewed_at|string(date-time)¦null|false|none|none|
|»» reviewed_by|string(uuid)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get listener request detail (admin alias)

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/admin/listener-requests/{verificationId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/listener-requests/{verificationId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/admin/listener-requests/{verificationId}`

Alias endpoint for retrieving one listener verification submission and related verification history for moderation screens.

<h3 id="get-listener-request-detail-(admin-alias)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|verificationId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submission": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "listener_id": "68633f4f-f52a-402f-8572-b8173418904f",
    "listener_email": "user@example.com",
    "gender_identity": "string",
    "preferred_language": "string",
    "ethnicity": "string",
    "age_group": "string",
    "lgbtq_identity": "string",
    "special_topics": [
      "string"
    ],
    "faith_or_belief": "string",
    "status": "pending",
    "file_url": "string",
    "original_file_name": "string",
    "mime_type": "string",
    "file_size_bytes": 0,
    "admin_notes": "string",
    "reviewed_by": "92ab4dbc-1b27-40ce-b24b-7dde8f4709be",
    "reviewed_at": "2019-08-24T14:15:22Z",
    "document_url": "string",
    "verificationDocuments": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "status": "pending",
        "original_file_name": "string",
        "mime_type": "string",
        "file_size_bytes": 0,
        "created_at": "2019-08-24T14:15:22Z",
        "reviewed_at": "2019-08-24T14:15:22Z",
        "admin_notes": "string"
      }
    ]
  }
}
```

<h3 id="get-listener-request-detail-(admin-alias)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Listener request detail retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Submission not found|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="get-listener-request-detail-(admin-alias)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submission|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» listener_id|string(uuid)|false|none|none|
|»» listener_email|string(email)|false|none|none|
|»» gender_identity|string¦null|false|none|none|
|»» preferred_language|string¦null|false|none|none|
|»» ethnicity|string¦null|false|none|none|
|»» age_group|string¦null|false|none|none|
|»» lgbtq_identity|string¦null|false|none|none|
|»» special_topics|[string]|false|none|none|
|»» faith_or_belief|string¦null|false|none|none|
|»» status|string|false|none|none|
|»» file_url|string¦null|false|none|none|
|»» original_file_name|string|false|none|none|
|»» mime_type|string|false|none|none|
|»» file_size_bytes|integer|false|none|none|
|»» admin_notes|string¦null|false|none|none|
|»» reviewed_by|string(uuid)¦null|false|none|none|
|»» reviewed_at|string(date-time)¦null|false|none|none|
|»» document_url|string¦null|false|none|none|
|»» verificationDocuments|[object]|false|none|none|
|»»» id|string(uuid)|false|none|none|
|»»» status|string|false|none|none|
|»»» original_file_name|string|false|none|none|
|»»» mime_type|string|false|none|none|
|»»» file_size_bytes|integer|false|none|none|
|»»» created_at|string(date-time)|false|none|none|
|»»» reviewed_at|string(date-time)¦null|false|none|none|
|»»» admin_notes|string¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|approved|
|status|rejected|
|status|pending|
|status|approved|
|status|rejected|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Review listener request (admin alias)

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/admin/listener-requests/{verificationId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "status": "verified",
  "adminNotes": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/admin/listener-requests/{verificationId}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/admin/listener-requests/{verificationId}`

Alias endpoint to approve or reject pending listener verification submissions. Accessible by admin and active sub-admin users with admin-panel edit permission.

> Body parameter

```json
{
  "status": "verified",
  "adminNotes": "string"
}
```

<h3 id="review-listener-request-(admin-alias)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|verificationId|path|string(uuid)|true|none|
|body|body|object|true|none|
|» status|body|string|true|none|
|» adminNotes|body|string¦null|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» status|verified|
|» status|rejected|

> Example responses

> 200 Response

```json
{
  "success": true,
  "submission": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "listener_id": "68633f4f-f52a-402f-8572-b8173418904f",
    "status": "approved",
    "reviewed_at": "2019-08-24T14:15:22Z",
    "s3_deleted_at": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="review-listener-request-(admin-alias)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Listener request reviewed|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[AuthTokenExpiredError](#schemaauthtokenexpirederror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin or eligible sub-admin required)|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Submission not found|[Error](#schemaerror)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Submission is not pending|[Error](#schemaerror)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|[Error](#schemaerror)|

<h3 id="review-listener-request-(admin-alias)-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» submission|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» listener_id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» reviewed_at|string(date-time)|false|none|none|
|»» s3_deleted_at|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|approved|
|status|rejected|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-sub-admin-management">Sub Admin Management</h1>

Admin-managed sub-admin account and permission lifecycle

## List sub-admin accounts

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sub-admins \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sub-admins`

Get all sub-admin users and their permission profiles.

> Example responses

> 200 Response

```json
{
  "subAdmins": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "email": "user@example.com",
      "phone": "string",
      "userType": "sub_admin",
      "activeRole": "sub_admin",
      "availableRoles": [
        "sub_admin"
      ],
      "isVerified": true,
      "isActive": true,
      "status": "pending",
      "permissions": {
        "view": true,
        "edit": true,
        "delete": true,
        "suspend": true,
        "accessAdminPanel": true
      },
      "createdBy": "25a02396-1048-48f9-bf93-102d2fb7895e",
      "createdAt": "2019-08-24T14:15:22Z",
      "updatedAt": "2019-08-24T14:15:22Z"
    }
  ]
}
```

<h3 id="list-sub-admin-accounts-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sub-admin list retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (admin role required)|[Error](#schemaerror)|

<h3 id="list-sub-admin-accounts-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» subAdmins|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» phone|string¦null|false|none|none|
|»» userType|string|false|none|none|
|»» activeRole|string|false|none|none|
|»» availableRoles|[string]|false|none|none|
|»» isVerified|boolean|false|none|none|
|»» isActive|boolean|false|none|none|
|»» status|string|false|none|none|
|»» permissions|object|false|none|none|
|»»» view|boolean|false|none|none|
|»»» edit|boolean|false|none|none|
|»»» delete|boolean|false|none|none|
|»»» suspend|boolean|false|none|none|
|»»» accessAdminPanel|boolean|false|none|none|
|»» createdBy|string(uuid)¦null|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|sub_admin|
|activeRole|sub_admin|
|status|pending|
|status|active|
|status|suspended|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Create sub-admin account

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/sub-admins \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "email": "subadmin@example.com",
  "password": "SubAdmin123",
  "phone": "+15551234567",
  "permissions": {
    "view": true,
    "edit": true,
    "delete": false,
    "suspend": false,
    "accessAdminPanel": true
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/sub-admins`

Create a new sub-admin account with initial feature permissions. Newly created sub-admins start with pending status.

> Body parameter

```json
{
  "email": "subadmin@example.com",
  "password": "SubAdmin123",
  "phone": "+15551234567",
  "permissions": {
    "view": true,
    "edit": true,
    "delete": false,
    "suspend": false,
    "accessAdminPanel": true
  }
}
```

<h3 id="create-sub-admin-account-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» email|body|string(email)|true|none|
|» password|body|string(password)|true|none|
|» phone|body|string¦null|false|none|
|» permissions|body|object|false|none|
|»» view|body|boolean|false|none|
|»» edit|body|boolean|false|none|
|»» delete|body|boolean|false|none|
|»» suspend|body|boolean|false|none|
|»» accessAdminPanel|body|boolean|false|none|

> Example responses

> 201 Response

```json
{
  "message": "Sub-admin created successfully",
  "subAdmin": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "status": "pending",
    "permissions": {
      "view": true,
      "edit": true,
      "delete": true,
      "suspend": true,
      "accessAdminPanel": true
    }
  }
}
```

<h3 id="create-sub-admin-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Sub-admin created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error|[Error](#schemaerror)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Conflict (email already exists)|[Error](#schemaerror)|

<h3 id="create-sub-admin-account-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» subAdmin|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» status|string|false|none|none|
|»» permissions|object|false|none|none|
|»»» view|boolean|false|none|none|
|»»» edit|boolean|false|none|none|
|»»» delete|boolean|false|none|none|
|»»» suspend|boolean|false|none|none|
|»»» accessAdminPanel|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## List pending sub-admin requests

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sub-admins/pending \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins/pending',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sub-admins/pending`

Get sub-admin accounts currently in pending onboarding status.

> Example responses

> 200 Response

```json
{
  "pendingRequests": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "email": "user@example.com",
      "status": "pending",
      "permissions": {
        "view": true,
        "edit": true,
        "delete": true,
        "suspend": true,
        "accessAdminPanel": true
      }
    }
  ]
}
```

<h3 id="list-pending-sub-admin-requests-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Pending sub-admin requests retrieved|Inline|

<h3 id="list-pending-sub-admin-requests-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» pendingRequests|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» status|string|false|none|none|
|»» permissions|object|false|none|none|
|»»» view|boolean|false|none|none|
|»»» edit|boolean|false|none|none|
|»»» delete|boolean|false|none|none|
|»»» suspend|boolean|false|none|none|
|»»» accessAdminPanel|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get sub-admin profile

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sub-admins/{subAdminId}`

Fetch one sub-admin account with permission profile.

<h3 id="get-sub-admin-profile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|subAdminId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "subAdmin": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "status": "pending",
    "permissions": {
      "view": true,
      "edit": true,
      "delete": true,
      "suspend": true,
      "accessAdminPanel": true
    }
  }
}
```

<h3 id="get-sub-admin-profile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sub-admin profile retrieved|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Sub-admin not found|[Error](#schemaerror)|

<h3 id="get-sub-admin-profile-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» subAdmin|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» status|string|false|none|none|
|»» permissions|object|false|none|none|
|»»» view|boolean|false|none|none|
|»»» edit|boolean|false|none|none|
|»»» delete|boolean|false|none|none|
|»»» suspend|boolean|false|none|none|
|»»» accessAdminPanel|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|suspended|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update sub-admin permissions

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "permissions": {
    "view": true,
    "edit": false,
    "delete": false,
    "suspend": true,
    "accessAdminPanel": true
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/sub-admins/{subAdminId}`

Update sub-admin feature-level permission toggles (view/edit/delete/suspend/accessAdminPanel). Only provided keys are changed; omitted keys retain existing values.

> Body parameter

```json
{
  "permissions": {
    "view": true,
    "edit": false,
    "delete": false,
    "suspend": true,
    "accessAdminPanel": true
  }
}
```

<h3 id="update-sub-admin-permissions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|subAdminId|path|string(uuid)|true|none|
|body|body|object|true|none|
|» permissions|body|object|true|none|
|»» view|body|boolean|false|none|
|»» edit|body|boolean|false|none|
|»» delete|body|boolean|false|none|
|»» suspend|body|boolean|false|none|
|»» accessAdminPanel|body|boolean|false|none|

> Example responses

> 200 Response

```json
{
  "message": "Sub-admin updated successfully",
  "subAdmin": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "permissions": {
      "view": true,
      "edit": true,
      "delete": true,
      "suspend": true,
      "accessAdminPanel": true
    }
  }
}
```

<h3 id="update-sub-admin-permissions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sub-admin permissions updated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid permissions payload|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Sub-admin not found|[Error](#schemaerror)|

<h3 id="update-sub-admin-permissions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» subAdmin|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» permissions|object|false|none|none|
|»»» view|boolean|false|none|none|
|»»» edit|boolean|false|none|none|
|»»» delete|boolean|false|none|none|
|»»» suspend|boolean|false|none|none|
|»»» accessAdminPanel|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Delete sub-admin account

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/sub-admins/{subAdminId}`

Delete a sub-admin account and its permission profile.

<h3 id="delete-sub-admin-account-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|subAdminId|path|string(uuid)|true|none|

> Example responses

> 200 Response

```json
{
  "message": "Sub-admin deleted successfully"
}
```

<h3 id="delete-sub-admin-account-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sub-admin deleted|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Sub-admin not found|[Error](#schemaerror)|

<h3 id="delete-sub-admin-account-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Update sub-admin status

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId}/status \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "status": "active"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sub-admins/{subAdminId}/status',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/sub-admins/{subAdminId}/status`

Update sub-admin lifecycle status (pending, active, suspended).

> Body parameter

```json
{
  "status": "active"
}
```

<h3 id="update-sub-admin-status-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|subAdminId|path|string(uuid)|true|none|
|body|body|object|true|none|
|» status|body|string|true|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» status|pending|
|» status|active|
|» status|suspended|

> Example responses

> 200 Response

```json
{
  "message": "Sub-admin status updated successfully",
  "subAdmin": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "pending",
    "isActive": true
  }
}
```

<h3 id="update-sub-admin-status-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sub-admin status updated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid status|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Sub-admin not found|[Error](#schemaerror)|

<h3 id="update-sub-admin-status-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» subAdmin|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» isActive|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|suspended|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-system">System</h1>

System health and monitoring endpoints

## Health check endpoint

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/health \
  -H 'Accept: application/json'

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/health',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /health`

Check the health status of the API and its dependencies (PostgreSQL and Redis)

> Example responses

> 200 Response

```json
{
  "status": "healthy",
  "timestamp": "2019-08-24T14:15:22Z",
  "services": {
    "postgres": "connected",
    "redis": "connected"
  }
}
```

<h3 id="health-check-endpoint-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|All services are healthy|Inline|
|503|[Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4)|One or more services are unhealthy|Inline|

<h3 id="health-check-endpoint-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» timestamp|string(date-time)|false|none|none|
|» services|object|false|none|none|
|»» postgres|string|false|none|none|
|»» redis|string|false|none|none|

Status Code **503**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» status|string|false|none|none|
|» error|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ventally-api-webhooks">Webhooks</h1>

External webhook endpoints for Stripe and Twilio integrations

## Stripe webhook endpoint

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/webhooks/stripe \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```javascript
const inputBody = '{
  "id": "string",
  "type": "checkout.session.completed",
  "data": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('{protocol}://{host}:{port}/api/v1/webhooks/stripe',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/webhooks/stripe`

Receives and processes Stripe webhook events for payments, subscriptions, and checkout sessions. Requires valid Stripe signature for security.

> Body parameter

```json
{
  "id": "string",
  "type": "checkout.session.completed",
  "data": {}
}
```

<h3 id="stripe-webhook-endpoint-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|false|Unique identifier for the event|
|» type|body|string|false|Event type|
|» data|body|object|false|Event data payload|

> Example responses

> 200 Response

```json
{
  "received": true,
  "duplicate": true
}
```

<h3 id="stripe-webhook-endpoint-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Webhook received and processed successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid signature or webhook error|Inline|

<h3 id="stripe-webhook-endpoint-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» received|boolean|false|none|none|
|» duplicate|boolean|false|none|Whether this was a duplicate event|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Twilio call status webhook

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/webhooks/twilio/call-status/{sessionId} \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Accept: text/plain'

```

```javascript
const inputBody = '{
  "CallSid": "string",
  "CallStatus": "completed",
  "CallDuration": 0,
  "From": "string",
  "To": "string",
  "Direction": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'text/plain'
};

fetch('{protocol}://{host}:{port}/api/v1/webhooks/twilio/call-status/{sessionId}',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/webhooks/twilio/call-status/{sessionId}`

Receives call status updates from Twilio (completed, failed, busy, no-answer). Updates session status accordingly.

> Body parameter

```yaml
CallSid: string
CallStatus: completed
CallDuration: 0
From: string
To: string
Direction: string

```

<h3 id="twilio-call-status-webhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|path|string(uuid)|true|Session ID to update|
|body|body|object|true|none|
|» CallSid|body|string|false|Twilio call SID|
|» CallStatus|body|string|false|Call status|
|» CallDuration|body|integer|false|Call duration in seconds|
|» From|body|string|false|Caller phone number|
|» To|body|string|false|Callee phone number|
|» Direction|body|string|false|Call direction|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» CallStatus|completed|
|» CallStatus|failed|
|» CallStatus|busy|
|» CallStatus|no-answer|

> Example responses

> 200 Response

```
"OK"
```

<h3 id="twilio-call-status-webhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Webhook processed successfully|string|

<aside class="success">
This operation does not require authentication
</aside>

## Twilio conference TwiML generator

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/webhooks/twilio/conference/{sessionId} \
  -H 'Accept: text/xml'

```

```javascript

const headers = {
  'Accept':'text/xml'
};

fetch('{protocol}://{host}:{port}/api/v1/webhooks/twilio/conference/{sessionId}',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/webhooks/twilio/conference/{sessionId}`

Generates TwiML instructions for conference calls. Called by Twilio when a participant joins a conference.

<h3 id="twilio-conference-twiml-generator-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|path|string(uuid)|true|Session ID for the conference|
|participant|query|string|false|Participant type (venter is host)|

#### Enumerated Values

|Parameter|Value|
|---|---|
|participant|venter|
|participant|listener|

> Example responses

> 200 Response

<h3 id="twilio-conference-twiml-generator-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TwiML response generated|string|

<aside class="success">
This operation does not require authentication
</aside>

## Twilio conference status webhook

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/webhooks/twilio/conference/status \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Accept: text/plain'

```

```javascript
const inputBody = '{
  "ConferenceSid": "string",
  "FriendlyName": "string",
  "StatusCallbackEvent": "participant-join",
  "Timestamp": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'text/plain'
};

fetch('{protocol}://{host}:{port}/api/v1/webhooks/twilio/conference/status',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/webhooks/twilio/conference/status`

Receives conference status updates from Twilio (participant-join, participant-leave, conference-start, conference-end).

> Body parameter

```yaml
ConferenceSid: string
FriendlyName: string
StatusCallbackEvent: participant-join
Timestamp: string

```

<h3 id="twilio-conference-status-webhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» ConferenceSid|body|string|false|Twilio conference SID|
|» FriendlyName|body|string|false|Conference name|
|» StatusCallbackEvent|body|string|false|Event type|
|» Timestamp|body|string|false|Event timestamp|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» StatusCallbackEvent|participant-join|
|» StatusCallbackEvent|participant-leave|
|» StatusCallbackEvent|conference-start|
|» StatusCallbackEvent|conference-end|

> Example responses

> 200 Response

```
"OK"
```

<h3 id="twilio-conference-status-webhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Webhook processed successfully|string|

<aside class="success">
This operation does not require authentication
</aside>

## Twilio recording status webhook

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/webhooks/twilio/recording \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Accept: text/plain'

```

```javascript
const inputBody = '{
  "RecordingSid": "string",
  "RecordingUrl": "string",
  "RecordingStatus": "completed",
  "RecordingDuration": 0,
  "CallSid": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'text/plain'
};

fetch('{protocol}://{host}:{port}/api/v1/webhooks/twilio/recording',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/webhooks/twilio/recording`

Receives recording status updates from Twilio. Stores recording information in the database.

> Body parameter

```yaml
RecordingSid: string
RecordingUrl: string
RecordingStatus: completed
RecordingDuration: 0
CallSid: string

```

<h3 id="twilio-recording-status-webhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» RecordingSid|body|string|false|Twilio recording SID|
|» RecordingUrl|body|string|false|URL to access the recording|
|» RecordingStatus|body|string|false|Recording status|
|» RecordingDuration|body|integer|false|Recording duration in seconds|
|» CallSid|body|string|false|Associated call SID|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» RecordingStatus|completed|
|» RecordingStatus|failed|

> Example responses

> 200 Response

```
"OK"
```

<h3 id="twilio-recording-status-webhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Webhook processed successfully|string|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ventally-api-sessions">Sessions</h1>

## Create a new call session

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/sessions \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "listenerId": "123e4567-e89b-12d3-a456-426614174000"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sessions',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/sessions`

Create a new call session between venter and listener. Validates wallet balance and payment method before creation.

> Body parameter

```json
{
  "listenerId": "123e4567-e89b-12d3-a456-426614174000"
}
```

<h3 id="create-a-new-call-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» listenerId|body|string(uuid)|true|ID of the listener to call|

> Example responses

> 201 Response

```json
{
  "message": "string",
  "session": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "venterId": "ea5f3151-3d6e-49a9-8bc4-43d7ba2661fa",
    "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
    "status": "pending",
    "ratePerMinute": 0.5,
    "estimatedCost": 2.5,
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="create-a-new-call-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Session created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request or insufficient balance|None|
|402|[Payment Required](https://tools.ietf.org/html/rfc7231#section-6.5.2)|Payment required - insufficient balance|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - account not verified or invalid user type|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Listener not found|None|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Active session already exists|None|

<h3 id="create-a-new-call-session-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» session|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» venterId|string(uuid)|false|none|none|
|»» listenerId|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» ratePerMinute|number|false|none|none|
|»» estimatedCost|number|false|none|none|
|»» createdAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get active sessions

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sessions/active \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sessions/active',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sessions/active`

Retrieve all active sessions for the authenticated user (venter or listener)

> Example responses

> 200 Response

```json
{
  "sessions": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "venterId": "ea5f3151-3d6e-49a9-8bc4-43d7ba2661fa",
      "venterEmail": "string",
      "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
      "listenerEmail": "string",
      "status": "pending",
      "ratePerMinute": 0,
      "createdAt": "2019-08-24T14:15:22Z",
      "acceptedAt": "2019-08-24T14:15:22Z",
      "startedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "count": 0
}
```

<h3 id="get-active-sessions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Active sessions retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|

<h3 id="get-active-sessions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» sessions|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» venterId|string(uuid)|false|none|none|
|»» venterEmail|string|false|none|none|
|»» listenerId|string(uuid)|false|none|none|
|»» listenerEmail|string|false|none|none|
|»» status|string|false|none|none|
|»» ratePerMinute|number|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» acceptedAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|» count|integer|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|accepted|
|status|active|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get session details

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/sessions/{sessionId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sessions/{sessionId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/sessions/{sessionId}`

Retrieve detailed information about a specific session

<h3 id="get-session-details-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|path|string(uuid)|true|Session ID|

> Example responses

> 200 Response

```json
{
  "session": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "venterId": "ea5f3151-3d6e-49a9-8bc4-43d7ba2661fa",
    "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
    "status": "string",
    "twilioCallSid": "string",
    "durationSeconds": 0,
    "ratePerMinute": 0,
    "estimatedCost": 0,
    "finalCost": 0,
    "createdAt": "2019-08-24T14:15:22Z",
    "acceptedAt": "2019-08-24T14:15:22Z",
    "startedAt": "2019-08-24T14:15:22Z",
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-session-details-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Session details retrieved|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - not authorized to view this session|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Session not found|None|

<h3 id="get-session-details-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» session|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» venterId|string(uuid)|false|none|none|
|»» listenerId|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» twilioCallSid|string|false|none|none|
|»» durationSeconds|integer|false|none|none|
|»» ratePerMinute|number|false|none|none|
|»» estimatedCost|number|false|none|none|
|»» finalCost|number|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» acceptedAt|string(date-time)|false|none|none|
|»» startedAt|string(date-time)|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Accept a call session

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/sessions/{sessionId}/accept \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sessions/{sessionId}/accept',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/sessions/{sessionId}/accept`

Accept a pending call session and initiate the Twilio call (listener only)

<h3 id="accept-a-call-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|path|string(uuid)|true|Session ID|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "session": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "active",
    "twilioCallSid": "string",
    "startedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="accept-a-call-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Session accepted and call initiated|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid session status|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Unauthorized - not the assigned listener|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Session not found|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Call initiation failed|None|

<h3 id="accept-a-call-session-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» session|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» twilioCallSid|string|false|none|none|
|»» startedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## End a call session

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/sessions/{sessionId}/end \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/sessions/{sessionId}/end',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/sessions/{sessionId}/end`

End an active call session and calculate final cost (venter or listener)

<h3 id="end-a-call-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|path|string(uuid)|true|Session ID|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "session": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "status": "ended",
    "durationSeconds": 0,
    "finalCost": 0,
    "endedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="end-a-call-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Session ended successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid session status|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Unauthorized - not a participant in this session|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Session not found|None|

<h3 id="end-a-call-session-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» session|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|
|»» durationSeconds|integer|false|none|none|
|»» finalCost|number|false|none|none|
|»» endedAt|string(date-time)|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-tips">Tips</h1>

## Send tip to listener for ended session

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/session/{sessionId}/tip \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "amountCurrency": 3.25,
  "message": "Thanks for the support"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/session/{sessionId}/tip',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/session/{sessionId}/tip`

Venter sends one tip per ended session (call or chat) within 24 hours. Payment is wallet-first with Stripe fallback.

> Body parameter

```json
{
  "amountCurrency": 3.25,
  "message": "Thanks for the support"
}
```

<h3 id="send-tip-to-listener-for-ended-session-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|sessionId|path|string(uuid)|true|The call or conversation session ID|
|body|body|object|true|none|
|» amountCurrency|body|number(float)|true|none|
|» message|body|string|false|none|

> Example responses

> 201 Response

```json
{
  "success": true,
  "status": "completed",
  "paymentSource": "wallet",
  "tip": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
    "sessionType": "call",
    "callId": "4722cd84-0ec7-4ef5-8c34-1b0150f45f53",
    "amountCurrency": 0.1,
    "status": "completed"
  }
}
```

<h3 id="send-tip-to-listener-for-ended-session-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Tip completed immediately (wallet)|Inline|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|Tip created and awaiting Stripe confirmation|Inline|
|402|[Payment Required](https://tools.ietf.org/html/rfc7231#section-6.5.2)|No payment method available for Stripe fallback|[Error](#schemaerror)|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Only venter for this session can tip|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Session not found|[Error](#schemaerror)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Session not ended or tip already exists|[Error](#schemaerror)|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Tip validation failed (amount/window/message)|[Error](#schemaerror)|

<h3 id="send-tip-to-listener-for-ended-session-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» status|string|false|none|none|
|» paymentSource|string|false|none|none|
|» tip|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» sessionId|string(uuid)|false|none|none|
|»» sessionType|string|false|none|none|
|»» callId|string(uuid)¦null|false|none|none|
|»» amountCurrency|number(float)|false|none|none|
|»» status|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

Status Code **202**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» status|string|false|none|none|
|» paymentSource|string|false|none|none|
|» paymentIntent|object|false|none|none|
|»» id|string|false|none|none|
|»» status|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get tips sent by authenticated venter

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/tips/sent \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/tips/sent',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/tips/sent`

<h3 id="get-tips-sent-by-authenticated-venter-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|none|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
{
  "tips": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "callId": "4722cd84-0ec7-4ef5-8c34-1b0150f45f53",
      "amountCurrency": 0.1,
      "currency": "USD",
      "paymentSource": "wallet",
      "status": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "completedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 0,
    "offset": 0,
    "hasMore": true
  }
}
```

<h3 id="get-tips-sent-by-authenticated-venter-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tips retrieved|Inline|

<h3 id="get-tips-sent-by-authenticated-venter-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» tips|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» callId|string(uuid)|false|none|none|
|»» amountCurrency|number(float)|false|none|none|
|»» currency|string|false|none|none|
|»» paymentSource|string|false|none|none|
|»» status|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» completedAt|string(date-time)¦null|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» hasMore|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|paymentSource|wallet|
|paymentSource|stripe|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get tips received by authenticated listener

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/tips/received \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/tips/received',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/tips/received`

<h3 id="get-tips-received-by-authenticated-listener-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|limit|query|integer|false|none|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
{
  "tips": [
    {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "callId": "4722cd84-0ec7-4ef5-8c34-1b0150f45f53",
      "amountCurrency": 0.1,
      "currency": "USD",
      "paymentSource": "wallet",
      "status": "string",
      "createdAt": "2019-08-24T14:15:22Z",
      "completedAt": "2019-08-24T14:15:22Z"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 0,
    "offset": 0,
    "hasMore": true
  }
}
```

<h3 id="get-tips-received-by-authenticated-listener-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tips retrieved|Inline|

<h3 id="get-tips-received-by-authenticated-listener-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» tips|[object]|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» callId|string(uuid)|false|none|none|
|»» amountCurrency|number(float)|false|none|none|
|»» currency|string|false|none|none|
|»» paymentSource|string|false|none|none|
|»» status|string|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» completedAt|string(date-time)¦null|false|none|none|
|» pagination|object|false|none|none|
|»» total|integer|false|none|none|
|»» limit|integer|false|none|none|
|»» offset|integer|false|none|none|
|»» hasMore|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|paymentSource|wallet|
|paymentSource|stripe|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get tip details

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/tips/{tipId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/tips/{tipId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/tips/{tipId}`

Retrieve a specific tip. Only the tip sender or receiver can access this record.

<h3 id="get-tip-details-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tipId|path|string(uuid)|true|The tip ID|

> Example responses

> 200 Response

```json
{
  "tip": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "callId": "4722cd84-0ec7-4ef5-8c34-1b0150f45f53",
    "venterId": "ea5f3151-3d6e-49a9-8bc4-43d7ba2661fa",
    "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
    "amountCurrency": 0.1,
    "currency": "USD",
    "message": "string",
    "paymentSource": "wallet",
    "status": "string",
    "failureReason": "string",
    "createdAt": "2019-08-24T14:15:22Z",
    "completedAt": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="get-tip-details-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tip details|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Not tip participant|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Tip not found|[Error](#schemaerror)|

<h3 id="get-tip-details-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» tip|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» callId|string(uuid)|false|none|none|
|»» venterId|string(uuid)|false|none|none|
|»» listenerId|string(uuid)|false|none|none|
|»» amountCurrency|number(float)|false|none|none|
|»» currency|string|false|none|none|
|»» message|string¦null|false|none|none|
|»» paymentSource|string|false|none|none|
|»» status|string|false|none|none|
|»» failureReason|string¦null|false|none|none|
|»» createdAt|string(date-time)|false|none|none|
|»» completedAt|string(date-time)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|paymentSource|wallet|
|paymentSource|stripe|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-user-management">User Management</h1>

## Switch user's active role

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/users/switch-role \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "targetRole": "listener"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/users/switch-role',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/users/switch-role`

Switch between available roles. Users can be both venter and listener, but only one role is active at a time. Role switching is blocked during active sessions.

> Body parameter

```json
{
  "targetRole": "listener"
}
```

<h3 id="switch-user's-active-role-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» targetRole|body|string|true|The role to switch to (must be in availableRoles)|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» targetRole|venter|
|» targetRole|listener|

> Example responses

> 200 Response

```json
{
  "message": "Successfully switched to listener role",
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "user": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "email": "user@example.com",
    "activeRole": "listener",
    "availableRoles": [
      "venter",
      "listener"
    ],
    "userType": "string"
  }
}
```

<h3 id="switch-user's-active-role-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role switched successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid role|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Role not available to user|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Active session prevents role switch|Inline|

<h3 id="switch-user's-active-role-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» tokens|object|false|none|none|
|»» accessToken|string|false|none|New JWT access token with updated role|
|»» refreshToken|string|false|none|New refresh token|
|» user|object|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» email|string(email)|false|none|none|
|»» activeRole|string|false|none|The newly active role|
|»» availableRoles|[string]|false|none|All roles user can switch between|
|»» userType|string|false|none|Backward compatibility field (equals activeRole)|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **409**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|
|» activeSession|object|false|none|none|
|»» type|string|false|none|none|
|»» id|string(uuid)|false|none|none|
|»» status|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|call|
|type|chat|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get user's current role configuration

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/users/roles \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/users/roles',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/users/roles`

Returns the user's active role and all available roles they can switch to

> Example responses

> 200 Response

```json
{
  "availableRoles": [
    "venter",
    "listener"
  ],
  "activeRole": "venter",
  "userType": "venter"
}
```

<h3 id="get-user's-current-role-configuration-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User role configuration|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized|[Error](#schemaerror)|

<h3 id="get-user's-current-role-configuration-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» availableRoles|[string]|false|none|All roles user can switch to|
|» activeRole|string|false|none|Currently active role|
|» userType|string|false|none|Backward compatibility field (equals activeRole)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Add or remove roles from user's available roles

> Code samples

```shell
# You can also use wget
curl -X PUT {protocol}://{host}:{port}/api/v1/users/available-roles \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "rolesToAdd": [
    "listener"
  ],
  "rolesToRemove": []
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/users/available-roles',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /api/v1/users/available-roles`

Allows users to add or remove roles from their available roles. Cannot remove currently active role. Cannot add privileged roles (admin, sub_admin) via this endpoint.

> Body parameter

```json
{
  "rolesToAdd": [
    "listener"
  ],
  "rolesToRemove": []
}
```

<h3 id="add-or-remove-roles-from-user's-available-roles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» rolesToAdd|body|[string]|false|Roles to add to available roles|
|» rolesToRemove|body|[string]|false|Roles to remove from available roles|

#### Enumerated Values

|Parameter|Value|
|---|---|
|» rolesToAdd|venter|
|» rolesToAdd|listener|
|» rolesToRemove|venter|
|» rolesToRemove|listener|

> Example responses

> 200 Response

```json
{
  "message": "Available roles updated successfully",
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "user": {
    "availableRoles": [
      "venter",
      "listener"
    ],
    "activeRole": "venter"
  }
}
```

<h3 id="add-or-remove-roles-from-user's-available-roles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Roles updated successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid operation (e.g., removing active role)|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden (e.g., attempting to add privileged role)|Inline|

<h3 id="add-or-remove-roles-from-user's-available-roles-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» tokens|object|false|none|none|
|»» accessToken|string|false|none|New JWT with updated available roles|
|»» refreshToken|string|false|none|none|
|» user|object|false|none|none|
|»» availableRoles|[string]|false|none|none|
|»» activeRole|string|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="ventally-api-signatures">Signatures</h1>

## Upload or update user signature

> Code samples

```shell
# You can also use wget
curl -X POST {protocol}://{host}:{port}/api/v1/signatures \
  -H 'Content-Type: multipart/form-data' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript
const inputBody = '{
  "signature": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/signatures',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api/v1/signatures`

Upload a signature image (PNG, JPEG, or SVG) for the authenticated user. If a signature already exists, it will be replaced and the old file will be deleted from S3.

> Body parameter

```yaml
signature: string

```

<h3 id="upload-or-update-user-signature-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» signature|body|string(binary)|true|Signature image file (PNG, JPEG, or SVG, max 5MB)|

> Example responses

> 200 Response

```json
{
  "message": "Signature uploaded successfully",
  "signature": {
    "url": "https://ventally-uploads.s3.us-east-1.amazonaws.com/signatures/user-uuid/file-uuid.png",
    "fileName": "abc123-uuid.png",
    "uploadedAt": "2026-02-11T23:45:00.000Z"
  }
}
```

<h3 id="upload-or-update-user-signature-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Signature uploaded successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid file or missing file|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="upload-or-update-user-signature-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» signature|object|false|none|none|
|»» url|string|false|none|none|
|»» fileName|string|false|none|none|
|»» uploadedAt|string(date-time)|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Delete own signature

> Code samples

```shell
# You can also use wget
curl -X DELETE {protocol}://{host}:{port}/api/v1/signatures \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/signatures',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /api/v1/signatures`

Delete the authenticated user's signature. Removes the database reference and deletes the file from S3.

> Example responses

> 200 Response

```json
{
  "message": "Signature deleted successfully"
}
```

<h3 id="delete-own-signature-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Signature deleted successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|No signature to delete|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="delete-own-signature-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## Get user signature

> Code samples

```shell
# You can also use wget
curl -X GET {protocol}://{host}:{port}/api/v1/signatures/{userId} \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('{protocol}://{host}:{port}/api/v1/signatures/{userId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /api/v1/signatures/{userId}`

Retrieve a user's signature. Access is restricted: users can only view their own signature, and admins can view any user's signature.

<h3 id="get-user-signature-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userId|path|string(uuid)|true|User ID (must be own ID or requester must be admin)|

> Example responses

> 200 Response

```json
{
  "signature": {
    "url": "https://ventally-uploads.s3.us-east-1.amazonaws.com/signatures/user-uuid/file-uuid.png",
    "updatedAt": "2026-02-11T23:45:00.000Z"
  }
}
```

<h3 id="get-user-signature-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Signature retrieved successfully|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - Invalid or missing token|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Access denied - Non-owner trying to access signature (non-admin)|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found or signature not uploaded|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Server error|Inline|

<h3 id="get-user-signature-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» signature|object|false|none|none|
|»» url|string|false|none|none|
|»» updatedAt|string(date-time)|false|none|none|

Status Code **401**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **403**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

# Schemas

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "email": "user@example.com",
  "userType": "venter",
  "activeRole": "venter",
  "availableRoles": [
    "venter",
    "listener"
  ],
  "phone": "string",
  "displayName": "string",
  "preferredLanguage": "en",
  "listenerSignature": "string",
  "verificationDocumentStatus": "not_submitted",
  "isVerified": true,
  "isActive": true,
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|User unique identifier|
|email|string(email)|false|none|User email address|
|userType|string|false|none|User role type (equals activeRole, kept for backward compatibility)|
|activeRole|string|false|none|Currently active role|
|availableRoles|[string]|false|none|All roles user can switch between|
|phone|string|false|none|User phone number|
|displayName|string¦null|false|none|Public display name of the user|
|preferredLanguage|string¦null|false|none|Preferred language code (for example: en, pt, es)|
|listenerSignature|string¦null|false|none|Listener signature URL or base64 value|
|verificationDocumentStatus|string¦null|false|none|Current listener verification document status|
|isVerified|boolean|false|none|Email verification status|
|isActive|boolean|false|none|Account active status|
|createdAt|string(date-time)|false|none|Account creation timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|userType|venter|
|userType|listener|
|userType|admin|
|userType|sub_admin|
|activeRole|venter|
|activeRole|listener|
|activeRole|admin|
|activeRole|sub_admin|
|verificationDocumentStatus|not_submitted|
|verificationDocumentStatus|pending|
|verificationDocumentStatus|approved|
|verificationDocumentStatus|rejected|

<h2 id="tocS_Wallet">Wallet</h2>
<!-- backwards compatibility -->
<a id="schemawallet"></a>
<a id="schema_Wallet"></a>
<a id="tocSwallet"></a>
<a id="tocswallet"></a>

```json
{
  "balanceMinutes": 0,
  "balanceCurrency": 0,
  "autoRechargeEnabled": true,
  "autoRechargeThreshold": 0,
  "autoRechargeAmount": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|balanceMinutes|number|false|none|Available calling minutes|
|balanceCurrency|number|false|none|Available currency balance|
|autoRechargeEnabled|boolean|false|none|Auto-recharge enabled status|
|autoRechargeThreshold|number|false|none|Minimum balance to trigger auto-recharge|
|autoRechargeAmount|number|false|none|Amount to recharge automatically|

<h2 id="tocS_Transaction">Transaction</h2>
<!-- backwards compatibility -->
<a id="schematransaction"></a>
<a id="schema_Transaction"></a>
<a id="tocStransaction"></a>
<a id="tocstransaction"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "type": "credit_purchase",
  "amountMinutes": 10.5,
  "amountCurrency": 5.25,
  "balanceAfterMinutes": 120.5,
  "balanceAfterCurrency": 60,
  "description": "Added 10 calling minutes",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Transaction unique identifier|
|type|string|false|none|Transaction type|
|amountMinutes|number|false|none|Minutes amount (positive for credits, negative for deductions)|
|amountCurrency|number|false|none|Currency amount in USD|
|balanceAfterMinutes|number|false|none|Wallet balance in minutes after transaction|
|balanceAfterCurrency|number|false|none|Wallet balance in currency after transaction|
|description|string|false|none|Transaction description|
|createdAt|string(date-time)|false|none|Transaction timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|type|credit_purchase|
|type|call_deduction|
|type|subscription_charge|
|type|refund|
|type|auto_recharge|

<h2 id="tocS_MoodEntry">MoodEntry</h2>
<!-- backwards compatibility -->
<a id="schemamoodentry"></a>
<a id="schema_MoodEntry"></a>
<a id="tocSmoodentry"></a>
<a id="tocsmoodentry"></a>

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
  "mood_type": "Happy",
  "category": "Work",
  "notes": "Had a productive day",
  "logged_date": "2026-02-05",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Mood entry unique identifier|
|user_id|string(uuid)|false|none|User ID who logged the mood|
|mood_type|string|false|none|The mood type|
|category|string|false|none|Optional category for mood context|
|notes|string|false|none|Optional notes about the mood|
|logged_date|string(date)|false|none|The date for which this mood is logged|
|created_at|string(date-time)|false|none|Timestamp when mood was first logged|
|updated_at|string(date-time)|false|none|Timestamp when mood was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

<h2 id="tocS_ReflectionEntry">ReflectionEntry</h2>
<!-- backwards compatibility -->
<a id="schemareflectionentry"></a>
<a id="schema_ReflectionEntry"></a>
<a id="tocSreflectionentry"></a>
<a id="tocsreflectionentry"></a>

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
  "mood_log_id": "650e8400-e29b-41d4-a716-446655440001",
  "reflection_text": "Today I reflected on my progress and felt grateful for how far I've come.",
  "reflection_date": "2026-02-10",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Reflection entry unique identifier|
|user_id|string(uuid)|false|none|User ID who created the reflection|
|mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|reflection_text|string|false|none|The text content of the reflection|
|reflection_date|string(date)|false|none|The date for which this reflection is saved|
|created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|

<h2 id="tocS_ReflectionEntryWithMood">ReflectionEntryWithMood</h2>
<!-- backwards compatibility -->
<a id="schemareflectionentrywithmood"></a>
<a id="schema_ReflectionEntryWithMood"></a>
<a id="tocSreflectionentrywithmood"></a>
<a id="tocsreflectionentrywithmood"></a>

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
  "mood_log_id": "650e8400-e29b-41d4-a716-446655440001",
  "reflection_text": "Today I reflected on my progress and felt grateful for how far I've come.",
  "reflection_date": "2026-02-10",
  "mood_type": "Happy",
  "category": "Work",
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Reflection entry unique identifier|
|user_id|string(uuid)|false|none|User ID who created the reflection|
|mood_log_id|string(uuid)|false|none|Optional reference to linked mood log for the same day|
|reflection_text|string|false|none|The text content of the reflection|
|reflection_date|string(date)|false|none|The date for which this reflection is saved|
|mood_type|string|false|none|Linked mood type (if available)|
|category|string|false|none|Linked mood category (if available)|
|created_at|string(date-time)|false|none|Timestamp when reflection was first created|
|updated_at|string(date-time)|false|none|Timestamp when reflection was last updated|

#### Enumerated Values

|Property|Value|
|---|---|
|mood_type|Happy|
|mood_type|Neutral|
|mood_type|Sad|
|mood_type|Anxious|
|mood_type|Mad|
|category|Work|
|category|Family|
|category|Health|
|category|Unknown|

<h2 id="tocS_SobrietyAchievement">SobrietyAchievement</h2>
<!-- backwards compatibility -->
<a id="schemasobrietyachievement"></a>
<a id="schema_SobrietyAchievement"></a>
<a id="tocSsobrietyachievement"></a>
<a id="tocssobrietyachievement"></a>

```json
{
  "code": "milestone_14",
  "label": "14 Days",
  "days_required": 14,
  "achieved": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|string|false|none|none|
|label|string|false|none|none|
|days_required|integer|false|none|none|
|achieved|boolean|false|none|none|

<h2 id="tocS_SobrietyStatus">SobrietyStatus</h2>
<!-- backwards compatibility -->
<a id="schemasobrietystatus"></a>
<a id="schema_SobrietyStatus"></a>
<a id="tocSsobrietystatus"></a>
<a id="tocssobrietystatus"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
  "sober_start_date": "2026-02-01",
  "last_relapse_date": "2026-01-31",
  "notes": "string",
  "days_sober": 14,
  "achievements": [
    {
      "code": "milestone_14",
      "label": "14 Days",
      "days_required": 14,
      "achieved": true
    }
  ],
  "created_at": "2019-08-24T14:15:22Z",
  "updated_at": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|user_id|string(uuid)|false|none|none|
|sober_start_date|string(date)|false|none|none|
|last_relapse_date|string(date)¦null|false|none|none|
|notes|string¦null|false|none|none|
|days_sober|integer|false|none|none|
|achievements|[[SobrietyAchievement](#schemasobrietyachievement)]|false|none|none|
|created_at|string(date-time)|false|none|none|
|updated_at|string(date-time)|false|none|none|

<h2 id="tocS_SobrietyEvent">SobrietyEvent</h2>
<!-- backwards compatibility -->
<a id="schemasobrietyevent"></a>
<a id="schema_SobrietyEvent"></a>
<a id="tocSsobrietyevent"></a>
<a id="tocssobrietyevent"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "user_id": "a169451c-8525-4352-b8ca-070dd449a1a5",
  "event_type": "relapse",
  "event_date": "2026-02-20",
  "restart_date": "2026-02-20",
  "notes": "string",
  "created_at": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|user_id|string(uuid)|false|none|none|
|event_type|string|false|none|none|
|event_date|string(date)|false|none|none|
|restart_date|string(date)¦null|false|none|none|
|notes|string¦null|false|none|none|
|created_at|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|event_type|start|
|event_type|relapse|
|event_type|adjustment|

<h2 id="tocS_HomeRecentEntry">HomeRecentEntry</h2>
<!-- backwards compatibility -->
<a id="schemahomerecententry"></a>
<a id="schema_HomeRecentEntry"></a>
<a id="tocShomerecententry"></a>
<a id="tocshomerecententry"></a>

```json
{
  "id": "string",
  "entry_type": "mood",
  "entry_date": "2019-08-24",
  "created_at": "2019-08-24T14:15:22Z",
  "title": "Happy",
  "content": "string",
  "category": "string",
  "mood_type": "string",
  "mood_log_id": "542514ce-2587-446c-839b-55ba3d58cbaa"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|entry_type|string|false|none|none|
|entry_date|string(date)|false|none|none|
|created_at|string(date-time)|false|none|none|
|title|string|false|none|none|
|content|string¦null|false|none|none|
|category|string¦null|false|none|none|
|mood_type|string¦null|false|none|none|
|mood_log_id|string(uuid)¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|entry_type|mood|
|entry_type|reflection|

<h2 id="tocS_AnonymousIdentity">AnonymousIdentity</h2>
<!-- backwards compatibility -->
<a id="schemaanonymousidentity"></a>
<a id="schema_AnonymousIdentity"></a>
<a id="tocSanonymousidentity"></a>
<a id="tocsanonymousidentity"></a>

```json
{
  "anonymousName": "Swift Fox",
  "avatarSeed": "a1b2c3d4e5f6"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|anonymousName|string|false|none|Auto-generated friendly name like 'Swift Fox'|
|avatarSeed|string|false|none|Seed for generating consistent avatar on client|

<h2 id="tocS_ListenerProfile">ListenerProfile</h2>
<!-- backwards compatibility -->
<a id="schemalistenerprofile"></a>
<a id="schema_ListenerProfile"></a>
<a id="tocSlistenerprofile"></a>
<a id="tocslistenerprofile"></a>

```json
{
  "listenerId": "99031352-8e53-414e-b2bc-c3cd0d5bbf70",
  "ratePerMinute": 0.5,
  "totalSessions": 42,
  "averageRating": 4.5,
  "bioAnonymous": "I'm here to listen and support you",
  "specialties": [
    "anxiety",
    "relationships",
    "stress"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|listenerId|string(uuid)|false|none|Listener user ID|
|ratePerMinute|number(float)|false|none|Rate in USD per minute|
|totalSessions|integer|false|none|Total completed sessions|
|averageRating|number(float)|false|none|Average rating from 1-5|
|bioAnonymous|string|false|none|Anonymous bio (no identifying info)|
|specialties|[string]|false|none|none|

<h2 id="tocS_Conversation">Conversation</h2>
<!-- backwards compatibility -->
<a id="schemaconversation"></a>
<a id="schema_Conversation"></a>
<a id="tocSconversation"></a>
<a id="tocsconversation"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "status": "pending",
  "otherParticipant": {
    "anonymousName": "Swift Fox",
    "avatarSeed": "a1b2c3d4e5f6"
  },
  "ratePerMinute": 0.5,
  "durationMinutes": 15,
  "totalCost": 7.5,
  "createdAt": "2019-08-24T14:15:22Z",
  "startedAt": "2019-08-24T14:15:22Z",
  "endedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Conversation ID|
|status|string|false|none|Conversation status|
|otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|ratePerMinute|number(float)|false|none|none|
|durationMinutes|integer|false|none|none|
|totalCost|number(float)|false|none|none|
|createdAt|string(date-time)|false|none|none|
|startedAt|string(date-time)|false|none|none|
|endedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|pending|
|status|active|
|status|ended|
|status|declined|

<h2 id="tocS_Message">Message</h2>
<!-- backwards compatibility -->
<a id="schemamessage"></a>
<a id="schema_Message"></a>
<a id="tocSmessage"></a>
<a id="tocsmessage"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "content": "Hello, how can I help?",
  "sender": {
    "anonymousName": "Swift Fox",
    "avatarSeed": "a1b2c3d4e5f6",
    "isMe": true
  },
  "deliveredAt": "2019-08-24T14:15:22Z",
  "readAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|content|string|false|none|none|
|sender|any|false|none|none|

allOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|

and

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» isMe|boolean|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deliveredAt|string(date-time)|false|none|none|
|readAt|string(date-time)|false|none|none|
|createdAt|string(date-time)|false|none|none|

<h2 id="tocS_VoiceCall">VoiceCall</h2>
<!-- backwards compatibility -->
<a id="schemavoicecall"></a>
<a id="schema_VoiceCall"></a>
<a id="tocSvoicecall"></a>
<a id="tocsvoicecall"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "status": "requesting",
  "otherParticipant": {
    "anonymousName": "Swift Fox",
    "avatarSeed": "a1b2c3d4e5f6"
  },
  "roomName": "string",
  "ratePerMinute": 0.5,
  "durationSeconds": 900,
  "totalCost": 7.5,
  "createdAt": "2019-08-24T14:15:22Z",
  "startedAt": "2019-08-24T14:15:22Z",
  "endedAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|none|
|status|string|false|none|none|
|otherParticipant|[AnonymousIdentity](#schemaanonymousidentity)|false|none|none|
|roomName|string|false|none|Twilio room name|
|ratePerMinute|number(float)|false|none|none|
|durationSeconds|integer|false|none|none|
|totalCost|number(float)|false|none|none|
|createdAt|string(date-time)|false|none|none|
|startedAt|string(date-time)|false|none|none|
|endedAt|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|requesting|
|status|ringing|
|status|active|
|status|ended|
|status|declined|
|status|cancelled|

<h2 id="tocS_Review">Review</h2>
<!-- backwards compatibility -->
<a id="schemareview"></a>
<a id="schema_Review"></a>
<a id="tocSreview"></a>
<a id="tocsreview"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "sessionType": "call",
  "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
  "reviewerId": "6426b718-0cec-4a62-ba39-47b50ade3870",
  "revieweeId": "6fad12bc-7643-4b0d-8d90-cf8e97d62387",
  "rating": 5,
  "comment": "Great listener, very helpful!",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Review unique identifier|
|sessionType|string|false|none|Type of session reviewed|
|sessionId|string(uuid)|false|none|Session ID that was reviewed|
|reviewerId|string(uuid)|false|none|ID of user who submitted the review|
|revieweeId|string(uuid)|false|none|ID of user who received the review|
|rating|integer|false|none|Rating from 1 to 5 stars|
|comment|string|false|none|Optional review comment|
|createdAt|string(date-time)|false|none|Review submission timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|

<h2 id="tocS_ListenerEarnings">ListenerEarnings</h2>
<!-- backwards compatibility -->
<a id="schemalistenerearnings"></a>
<a id="schema_ListenerEarnings"></a>
<a id="tocSlistenerearnings"></a>
<a id="tocslistenerearnings"></a>

```json
{
  "totalEarnings": 125.5,
  "pendingBalance": 75,
  "paidOut": 50.5,
  "sessionCount": 15
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|totalEarnings|number(float)|false|none|none|
|pendingBalance|number(float)|false|none|none|
|paidOut|number(float)|false|none|none|
|sessionCount|integer|false|none|none|

<h2 id="tocS_Tokens">Tokens</h2>
<!-- backwards compatibility -->
<a id="schematokens"></a>
<a id="schema_Tokens"></a>
<a id="tocStokens"></a>
<a id="tocstokens"></a>

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|accessToken|string|false|none|JWT access token (expires in 7 days)|
|refreshToken|string|false|none|JWT refresh token (expires in 30 days)|

<h2 id="tocS_Report">Report</h2>
<!-- backwards compatibility -->
<a id="schemareport"></a>
<a id="schema_Report"></a>
<a id="tocSreport"></a>
<a id="tocsreport"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "reporterId": "997c436a-2349-4904-8879-2f8ba4e8669d",
  "reportedId": "7e2a4dc3-549e-4f0a-9b95-d46235525636",
  "sessionType": "call",
  "sessionId": "f6567dd8-e069-418e-8893-7d22fcf12459",
  "sessionVenterId": "b18b7266-dd8b-4e2e-985b-adc34be7ee73",
  "sessionListenerId": "77c1612d-53c9-44d6-8dd7-8de8046313c2",
  "reason": "bullying_or_harassment",
  "description": "string",
  "status": "pending",
  "adminNotes": "string",
  "reviewedBy": "849e71dc-4e73-4d65-b54c-c7fc0faacffa",
  "reviewedAt": "2019-08-24T14:15:22Z",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string(uuid)|false|none|Report unique identifier|
|reporterId|string(uuid)|false|none|ID of user who submitted the report|
|reportedId|string(uuid)|false|none|ID of user being reported|
|sessionType|string|false|none|Type of session (if applicable)|
|sessionId|string(uuid)|false|none|Session ID where the incident occurred|
|sessionVenterId|string(uuid)|false|none|Resolved venter ID from the linked session|
|sessionListenerId|string(uuid)|false|none|Resolved listener ID from the linked session|
|reason|string|false|none|Reason for report|
|description|string|false|none|Detailed description of the incident|
|status|string|false|none|Current status of the report|
|adminNotes|string|false|none|Admin notes (admin only)|
|reviewedBy|string(uuid)|false|none|ID of admin who reviewed the report|
|reviewedAt|string(date-time)|false|none|Timestamp when report was reviewed|
|createdAt|string(date-time)|false|none|Report submission timestamp|

#### Enumerated Values

|Property|Value|
|---|---|
|sessionType|call|
|sessionType|chat|
|reason|disruptive_behavior|
|reason|bullying_or_harassment|
|reason|danger_to_self_or_others|
|reason|inappropriate_or_unsafe_response|
|status|pending|
|status|reviewing|
|status|resolved|
|status|dismissed|

<h2 id="tocS_Pagination">Pagination</h2>
<!-- backwards compatibility -->
<a id="schemapagination"></a>
<a id="schema_Pagination"></a>
<a id="tocSpagination"></a>
<a id="tocspagination"></a>

```json
{
  "limit": 20,
  "offset": 0,
  "total": 100
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|limit|integer|false|none|Number of items per page|
|offset|integer|false|none|Number of items to skip|
|total|integer|false|none|Total number of items|

<h2 id="tocS_Error">Error</h2>
<!-- backwards compatibility -->
<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "error": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|error|string|false|none|Error message|

<h2 id="tocS_AuthTokenExpiredError">AuthTokenExpiredError</h2>
<!-- backwards compatibility -->
<a id="schemaauthtokenexpirederror"></a>
<a id="schema_AuthTokenExpiredError"></a>
<a id="tocSauthtokenexpirederror"></a>
<a id="tocsauthtokenexpirederror"></a>

```json
{
  "success": false,
  "error_type": "token_expired",
  "message": "Authentication token has expired",
  "action_required": "refresh_token"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|false|none|none|
|error_type|string|false|none|none|
|message|string|false|none|none|
|action_required|string|false|none|none|

<h2 id="tocS_TwoFactorAuthentication">TwoFactorAuthentication</h2>
<!-- backwards compatibility -->
<a id="schematwofactorauthentication"></a>
<a id="schema_TwoFactorAuthentication"></a>
<a id="tocStwofactorauthentication"></a>
<a id="tocstwofactorauthentication"></a>

```json
{
  "enabled": true,
  "method": "authenticator_app"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|enabled|boolean|false|none|none|
|method|string¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|method|sms|
|method|email|
|method|authenticator_app|

<h2 id="tocS_Success">Success</h2>
<!-- backwards compatibility -->
<a id="schemasuccess"></a>
<a id="schema_Success"></a>
<a id="tocSsuccess"></a>
<a id="tocssuccess"></a>

```json
{
  "message": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|message|string|false|none|Success message|

