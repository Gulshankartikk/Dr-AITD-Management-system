const BASE_URL = 'http://localhost:4000/api';

const testApi = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: '2301660100001',
                password: 'Student123',
                role: 'student'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        console.log('Login Data:', JSON.stringify(loginData, null, 2));
        const { token, user } = loginData;
        console.log('Login Successful. Token received.');
        console.log(`Student ID: ${user?.id}`);

        // 2. Get Resources
        console.log('Fetching resources...');
        const resourcesRes = await fetch(`${BASE_URL}/student/${user?.id}/resources`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!resourcesRes.ok) {
            const errText = await resourcesRes.text();
            throw new Error(`Fetch resources failed: ${resourcesRes.status} ${resourcesRes.statusText} - ${errText}`);
        }

        const text = await resourcesRes.text();
        console.log('Raw Response:', text);

        try {
            const resourcesData = JSON.parse(text);
            console.log('Parsed Resources Data:', JSON.stringify(resourcesData, null, 2));
            const resources = resourcesData.resources;
            console.log(`Fetched ${resources?.length} resources.`);
        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

testApi();
