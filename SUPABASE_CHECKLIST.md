# Supabase Setup Checklist

## ✅ **Step 1: Create Supabase Account & Project**

- [ ] Go to [supabase.com](https://supabase.com) and sign up
- [ ] Click "New Project"
- [ ] Fill in project details:
  - **Name**: `date-night-restaurants`
  - **Database Password**: Create a strong password (save this!)
  - **Region**: Choose closest to your users (US West for LA)
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for the project to initialize

## ✅ **Step 2: Get Your API Keys**

- [ ] Go to **Settings → API** in your Supabase dashboard
- [ ] Copy **Project URL** (looks like: `https://your-project-id.supabase.co`)
- [ ] Copy **Anon public key** (starts with `eyJ...`)
- [ ] Save them somewhere safe

## ✅ **Step 3: Set Up Environment Variables**

- [ ] Create `.env.local` file in your project root
- [ ] Add your Supabase URL and API key:
  ```bash
  SUPABASE_URL=your-project-url-here
  SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] Save the file

## ✅ **Step 4: Test Your Connection**

- [ ] Run: `npm run test-supabase`
- [ ] Check that connection is successful
- [ ] If you see "tables missing" - that's normal, proceed to step 5

## ✅ **Step 5: Set Up Database**

- [ ] Run: `npm run setup-database`
- [ ] Wait for the script to complete (it will migrate your LA restaurant data)
- [ ] Check for any errors in the output

## ✅ **Step 6: Verify Everything Works**

- [ ] Run: `npm run test-supabase` again
- [ ] Should show "All tables exist!" and restaurant count
- [ ] Run: `npm run build`
- [ ] Run: `npm run preview`
- [ ] Visit `/admin` to see your admin dashboard
- [ ] Test a few restaurant pages to make sure they still work

## 🎉 **You're Done!**

Once all steps are complete, you'll have:
- ✅ Database with all your LA restaurant data
- ✅ Admin dashboard at `/admin`
- ✅ All existing pages working
- ✅ Ready to add new cities

## 🚨 **Troubleshooting**

### If connection test fails:
- Check your `.env.local` file has the correct values
- Make sure your Supabase project is fully initialized
- Verify the API keys are correct

### If setup-database fails:
- Check the Supabase logs in your dashboard
- Make sure you have the service role key for admin operations
- Try running the script again

### If pages don't load:
- Check that all environment variables are set
- Verify the database tables were created
- Check the browser console for errors

## 📞 **Need Help?**

- Check the console output for detailed error messages
- Visit [Supabase Documentation](https://supabase.com/docs)
- Join [Supabase Discord](https://discord.supabase.com)
