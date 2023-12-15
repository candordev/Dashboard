import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, Pressable, Button } from 'react-native';
import Text from '../Components/Native/Text';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { Endpoints } from '../utils/Endpoints';
import colors from '../Styles/colors';
import styles from '../Styles/styles';
import { useSignup } from '../Hooks/useSignup';
import { openTermsAndConditions } from '../utils/utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// import CheckBox from '@react-native-community/checkbox';
// import { Icon } from 'react-native-vector-icons/Icon';

type SignupScreenEmailDobProps = {
  route: any;
  navigation: any;
};


function SignupScreenEmailDob({
  route,
  navigation,
}: SignupScreenEmailDobProps): JSX.Element {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState([
    colors.gray,
    colors.gray,
    colors.gray,
    colors.gray,
    colors.gray,
    colors.gray,
  ]);
  const {signupUser, error, signUpWithEmail, setError} = useSignup();

  const updatePassword = (inputPassword: string) => {
    let arr = [...passwordError];

    if (inputPassword.length >= 8) {
      arr[0] = colors.purple;
    } else {
      arr[0] = colors.red;
    }

    if (/[A-Z]/.test(inputPassword)) {
      arr[1] = colors.purple;
    } else {
      arr[1] = colors.red;
    }

    if (/[a-z]/.test(inputPassword)) {
      arr[2] = colors.purple;
    } else {
      arr[2] = colors.red;
    }

    if (/\d/.test(inputPassword)) {
      arr[3] = colors.purple;
    } else {
      arr[3] = colors.red;
    }

    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(inputPassword)) {
      arr[4] = colors.purple;
    } else {
      arr[4] = colors.red;
    }

    if (inputPassword == confirmPassword) {
      arr[5] = colors.purple;
    } else {
      arr[5] = colors.red;
    }

    setPasswordError(arr);

    setPassword(inputPassword);
  };

  const updateConfirmPassword = (inputPassword: string) => {
    let arr = [...passwordError];

    if (inputPassword == password) {
      arr[5] = colors.purple;
    } else {
      arr[5] = colors.red;
    }

    setPasswordError(arr);

    setConfirmPassword(inputPassword);
  };

  const handleSignup = async () => { 
    setLoading(true);

    if (passwordError.some(color => color !== colors.purple)) {
      setError('Please fulfill the password requirements below');
      setLoading(false);
      return;
    } else if (!checkBox) {
      setError('Please agree to our terms');
      setLoading(false);
      return;
    }

    const token: string | undefined = await signUpWithEmail(email, password);


      await signupUser(
        firstName,
        lastName,
        email,
        username,
        token ?? '',
      );

  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const { userID } = route.params ? route.params : { userID: null };

  const verifyPassword = async () => {
    if (passwordError.some(color => color !== colors.purple)) {
        setError('Please fulfill the password requirements below');
        setLoading(false);
        return false ;
      } else if (!checkBox) {
        setError('Please agree to our terms');
        setLoading(false);
        return false;
      }
      return true;
  }

  const validateFields = async () => {
    try {

      setLoading(true);
      setEmailError('');
      setUsernameError('');
      setFirstNameError('');
      setLastNameError('');
      setError('')
    //   setFormError('');

    
  
      const emailValid = await doesEmailExistFirebase();
      const usernameValid = await validateUsername();
      const nameValid = validateName();
      const passwordValid = await verifyPassword();


      console.log("We here boi", emailValid, usernameValid, nameValid)
      if (emailValid && usernameValid && nameValid && passwordValid) {
        console.log("We here boi Ayy")
        handleSignup();
      } 
      

    //   else {
    //     setFormError('Please correct the errors before proceeding.');
    //   }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setLoading(false);
    }
  };
  


  const validateUsername = async () => {
    setUsernameError('');
    setLoading(true);

    try {
      let res = await fetch(
        Endpoints.validUsername +
          new URLSearchParams({
            username: username.trim(),
          }),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      let resJson = await res.json();
      setLoading(false);
      if (!res.ok) {
        setUsernameError('Invalid username');
        setLoading(false);
        return false;
      }
      if (res.ok) {
         setLoading(false);
         return true;
      }
    } catch (error) {
      setLoading(false);
      setUsernameError(String(error));
      return false;
    }
  };

  const doesEmailExistFirebase = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      setLoading(false);
  
      if (signInMethods.length) {
        // Email is taken, set the appropriate error
        if (signInMethods.includes('google.com')) {
          setEmailError('This email is taken. Please sign in with Google or try a different email.');
        } else if (signInMethods.includes('apple.com')) {
          setEmailError('This email is taken. Please sign in with Apple or try a different email.');
        } else {
          setEmailError('This email is taken. Please log in or try a different email.');
        }
        return false;
      }
  
      return true; // Email is not taken
    } catch (error) {
      setLoading(false);
      setEmailError('That email address is invalid!');
      return false;
    }
  };
  

  const validateName = () => {
    let isValid = true;
    if (firstName.trim().length === 0) {
      setFirstNameError('Please enter your first name');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (lastName.trim().length === 0) {
      setLastNameError('Please enter your last name');
      isValid = false;
    } else {
      setLastNameError('');
    }

    return isValid;
  };

  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      <View style={{ alignItems: 'center', marginHorizontal: 30 }}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            autoFocus={true}
            autoCapitalize="none"
          />
        </View>
        {emailError !== '' && (
          <Text style={{ color: colors.red, fontSize: 15, textAlign: 'center', marginTop: 5 }}>
            {emailError}
          </Text>
        )}

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
          />
        </View>
        {usernameError !== '' && (
          <Text style={{ color: colors.red, fontSize: 15, textAlign: 'center', marginTop: 5 }}>
            {usernameError}
          </Text>
        )}

       {/* First Name Input*/}
        <View style={styles.inputContainer}>
        <TextInput
        placeholderTextColor={colors.lightgray}
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => {
            setFirstName(text);
            setFirstNameError('')
        }}
        />
        </View>
        {firstNameError !== '' && (
        <Text style={{ color: colors.red, fontSize: 15, textAlign: 'center' }}>
        {firstNameError}
        </Text>
        )}

        {/* Last Name Input */}
        <View style={styles.inputContainer}>
        <TextInput
        placeholderTextColor={colors.lightgray}
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => {
            setLastName(text);
            setLastNameError('')
        }}
        />
        </View>
        {lastNameError !== '' && (
        <Text style={{ color: colors.red, fontSize: 15, textAlign: 'center' }}>
        {lastNameError}
        </Text>
        )}
<View style={{alignItems: 'center', marginHorizontal: 30}}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={updatePassword}
            secureTextEntry={!showPassword}
            autoFocus={true}
          />
          <Pressable onPress={toggleShowPassword} style={{padding: 12}}>
          {showPassword ? (
                <FaEyeSlash size={20} color={colors.lightgray} />
                ) : (
                <FaEye size={20} color={colors.lightgray} />
                )}

          </Pressable>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.lightgray}
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={updateConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <Pressable onPress={toggleShowConfirmPassword} style={{padding: 12}}>
          {showConfirmPassword ? (
                <FaEyeSlash size={20} color={colors.lightgray} />
                ) : (
                <FaEye size={20} color={colors.lightgray} />
                )}  
          </Pressable>
        </View>
        {error != '' && (
          <Text
            style={{
              color: colors.red,
              fontSize: 15,
              marginTop: 20,
              alignSelf: 'flex-start',
            }}>
            {error}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
            alignSelf: 'flex-start',
          }}>
          <input
            type="checkbox"
            checked={checkBox}
            onChange={(e) => setCheckBox(e.target.checked)}
            style={{ /* your styles here */ }}
            />
          <Pressable onPress={openTermsAndConditions}>
            <Text style={{marginLeft: 10, color: colors.gray, fontSize: 15}}>
              Please agree to our terms{' '}
              <Text
                style={{color: colors.purple, textDecorationLine: 'underline'}}>
                here
              </Text>
            </Text>
          </Pressable>
        </View>
        <View style={{width: '100%', alignItems: 'flex-start', marginTop: 20}}>
          <Text
            style={{
              color: passwordError.every(item => item === colors.purple)
                ? colors.purple
                : colors.gray,
              fontSize: 15,
              textAlign: 'center',
            }}>
            Passwords must contain:
          </Text>
          <View style={{marginLeft: 20}}>
            <Text style={{color: passwordError[0], fontSize: 15}}>
              8 characters
            </Text>
            <Text style={{color: passwordError[1], fontSize: 15}}>
              1 uppercase
            </Text>
            <Text style={{color: passwordError[2], fontSize: 15}}>
              1 lowercase
            </Text>
            <Text style={{color: passwordError[3], fontSize: 15}}>
              1 number
            </Text>
            <Text style={{color: passwordError[4], fontSize: 15}}>
              1 special character
            </Text>
            <Text style={{color: passwordError[5], fontSize: 15}}>
              Passwords match
            </Text>
          </View>
        </View>
      </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={validateFields}
          style={{
            marginTop: 16,
            height: 42,
            borderRadius: 8,
            backgroundColor: '#007bff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={loading} // Disable button while loading
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#ffffff' }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignupScreenEmailDob;

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}


